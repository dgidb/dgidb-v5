require "graphql/client"
require "graphql/client/http"

module Genome; module Importers; module ApiImporters; module Civic
  class ApiClient

    def enumerate_drugs
      response = send_query(DrugsQuery)
      Enumerator.new do |y|
        response.therapies.edges.each { |edge| y << edge.node }
        while response.therapies.page_info.has_next_page === true do
          response.therapies.edges.each { |edge| y << edge.node }
          response = send_query(DrugsQuery, response.therapies.page_info.end_cursor)
        end
      end
    end

    def enumerate_genes
      gene_edges = send_query(GenesQuery).genes.edges
      Enumerator.new do |y|
        until gene_edges.empty?
          gene_edges.each { |edge| y << edge.node }
          gene_edges = send_query(GenesQuery, gene_edges[-1].cursor).genes.edges
        end
      end
    end

    def enumerate_evidence_items
      evidence_items = send_query(InteractionsQuery).evidence_items.edges
      Enumerator.new do |y|
        until evidence_items.empty?
          evidence_items.each { |edge| y << edge.node }
          evidence_items = send_query(InteractionsQuery, evidence_items[-1].cursor).evidence_items.edges
        end
      end

    end

    private

    module CivicApi
      api_endpoint = 'https://civicdb.org/api/graphql/'
      HTTP = GraphQL::Client::HTTP.new(api_endpoint) do
        def headers(_context)
          { 'User-Agent': 'DGIdb CIViC importer' }
        end
      end

      Schema = GraphQL::Client.load_schema(HTTP)
      Client = GraphQL::Client.new(schema: Schema, execute: HTTP)
    end

    DrugsQuery = CivicApi::Client.parse <<-GRAPHQL
      query ($after: String!) {
        therapies(first: 50, after: $after) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              name
              ncitId
            }
          }
        }
      }
    GRAPHQL

    GenesQuery = CivicApi::Client.parse <<-GRAPHQL
      query ($after: String!) {
        genes(first: 50, after: $after) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              name
              entrezId
              fullName
              featureAliases
            }
          }
        }
      }
    GRAPHQL

    InteractionsQuery = CivicApi::Client.parse <<-GRAPHQL
      query ($after: String!) {
        evidenceItems(first: 50, after: $after, evidenceType: PREDICTIVE) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              id
              evidenceDirection
              evidenceRating
              status
              significance
              evidenceLevel
              molecularProfile {
                variants {
                  feature {
                    featureInstance {
                      ... on Gene {
                        name
                      }
                    }
                  }
                }
              }
              therapies {
                name
              }
              source {
                citationId
                sourceType
              }
            }
          }
        }
      }
    GRAPHQL

    def send_query(query, cursor = '')
      response = CivicApi::Client.query(query, variables: { 'after': cursor })
      response.data
    end
  end
end; end; end; end
