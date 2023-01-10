require "graphql/client"
require "graphql/client/http"

module Genome; module Importers; module ApiImporters; module Civic
  class ApiClient

    def enumerate_variants
      variant_edges = send_query
      Enumerator.new do |y|
        until variant_edges.empty?
          variant_edges.each { |edge| y << edge }
          variant_edges = send_query(variant_edges[-1].cursor)
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

    Query = CivicApi::Client.parse <<-GRAPHQL
      query($after: String!){
        variants(first: 50, after: $after) {
          edges {
            cursor
            node {
              gene {
                id
                entrezId
                officialName
                name
                geneAliases
              }
              molecularProfiles {
                nodes {
                  evidenceItems {
                    nodes {
                      name
                      id
                      significance
                      evidenceType
                      evidenceLevel
                      evidenceDirection
                      evidenceRating
                      link
                      therapies {
                        name
                        ncitId
                        id
                      }
                      source {
                        citation
                        citationId
                        pmcId
                        sourceType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    GRAPHQL

    def send_query(cursor = '')
      response = CivicApi::Client.query(Query, variables: { 'after': cursor })
      response.data.variants.edges
    end
  end
end; end; end; end
