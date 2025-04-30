require "graphql/client"
require "graphql/client/http"

module Genome; module Importers; module ApiImporters; module Civic
  class ApiClient
    attr_reader :genes_query, :drugs_query, :interactions_query, :client

    def initialize
      http = GraphQL::Client::HTTP.new('https://civicdb.org/api/graphql/') do
        def headers(_context)
          { 'User-Agent': 'DGIdb CIViC importer' }
        end
      end

      schema = GraphQL::Client.load_schema(http)
      @client = GraphQL::Client.new(schema: schema, execute: http)
      @client.allow_dynamic_queries = true
      @genes_query = client.parse(genes_query_contents)
      @drugs_query = client.parse(drugs_query_contents)
      @interactions_query = client.parse(interactions_query_contents)
    end

    def enumerate_drugs
      response = send_query(drugs_query)
      Enumerator.new do |y|
        while response.therapies.page_info.has_next_page === true do
          response.therapies.edges.each { |edge| y << edge.node }
          response = send_query(drugs_query, response.therapies.page_info.end_cursor)
        end
        response.therapies.edges.each { |edge| y << edge.node }
      end
    end
    def enumerate_genes
      response = send_query(genes_query)
      Enumerator.new do |y|
        while response.genes.page_info.has_next_page === true do
          response.genes.edges.each { |edge| y << edge.node }
          response = send_query(genes_query, response.genes.page_info.end_cursor)
        end
        response.genes.edges.each { |edge| y << edge.node }
      end
    end

    def enumerate_evidence_items
      response = send_query(interactions_query)
      Enumerator.new do |y|
        while response.evidence_items.page_info.has_next_page === true do
          response.evidence_items.edges.each { |edge| y << edge.node }
          response = send_query(interactions_query, response.evidence_items.page_info.end_cursor)
        end
        response.evidence_items.edges.each { |edge| y << edge.node }
      end
    end

    private
    def drugs_query_contents
      <<-GRAPHQL
        query ($after: String!) {
          therapies(first: 50, hasLinkedEvidence: true, after: $after) {
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
    end

    def genes_query_contents
      <<-GRAPHQL
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
    end

    def interactions_query_contents
      <<-GRAPHQL
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
                        __typename
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
    end

    def send_query(query, cursor = '')
      response = client.query(query, variables: { 'after': cursor })
      response.data
    end
  end
end; end; end; end
