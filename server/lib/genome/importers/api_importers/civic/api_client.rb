require "graphql/client"
require "graphql/client/http"

module Genome; module Importers; module ApiImporters; module Civic
  class ApiClient

    def enumerate_drugs
      response = send_query(DrugsQuery)
      Enumerator.new do |y|
        while response.therapies.page_info.has_next_page === true do
          response.therapies.edges.each { |edge| y << edge.node }
          response = send_query(DrugsQuery, response.therapies.page_info.end_cursor)
        end
        response.therapies.edges.each { |edge| y << edge.node }
      end
    end
    def enumerate_genes
      response = send_query(GenesQuery)
      Enumerator.new do |y|
        while response.genes.page_info.has_next_page === true do
          response.genes.edges.each { |edge| y << edge.node }
          response = send_query(GenesQuery, response.genes.page_info.end_cursor)
        end
        response.genes.edges.each { |edge| y << edge.node }
      end
    end

    def enumerate_evidence_items
      response = send_query(InteractionsQuery)
      Enumerator.new do |y|
        while response.evidence_items.page_info.has_next_page === true do
          response.evidence_items.edges.each { |edge| y << edge.node }
          response = send_query(InteractionsQuery, response.evidence_items.page_info.end_cursor)
        end
        response.evidence_items.edges.each { |edge| y << edge.node }
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
