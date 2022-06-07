require "graphql/client"
require "graphql/client/http"

module Genome; module Importers; module ApiImporters; module Civic
  class ApiClient

    ##
    # this should be an actual enumerator but the ruby docs confuse me
    # so for now, just call until you get nil

    def enumerate_variants(cursor = '')
      response = get_entries(cursor)
      response.data.variants.edges
    end

    private

    module CivicApi
      api_endpoint = 'https://civicdb.org/api/graphql/'
      HTTP = GraphQL::Client::HTTP.new(api_endpoint) do
        def headers(context)
          { "User-Agent": 'DGIDB' }
        end
      end

      Schema = GraphQL::Client.load_schema(HTTP)
      Client = GraphQL::Client.new(schema: Schema, execute: HTTP)
    end

    Query = CivicApi::Client.parse <<-GRAPHQL
      query($after: String!){
        variants(first: 25, after: $after) {
          edges {
            cursor
            node {
              gene {
                id
                entrezId
                officialName
                name
                link
              }
              evidenceItems {
                nodes {
                  id
                  clinicalSignificance
                  evidenceLevel
                  drugs {
                    name
                    ncitId
                    id
                  }
                  source {
                    citation
                    sourceType
                  }
                }
              }
            }
          }
        }
      }
    GRAPHQL

    def get_entries(cursor)
      CivicApi::Client.query(Query, variables: { 'after': cursor })
    end
  end
end; end; end; end
