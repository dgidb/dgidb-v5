require "graphql/client"
require "graphql/client/http"
require 'open-uri'

module Genome; module Importers; module ApiImporters; module Pharos;
  class ApiClient
    categories_to_get = ['ENZYME', 'TRANSCRIPTION FACTOR', 'KINASE', 'TRANSPORTER', 'GPCR', 'ION CHANNEL', 'NUCLEAR RECEPTOR']
    category = categories_to_get.pop

    def enumerate_genes(category)
      skip = 0
      top = 50
      genes = send_query(category, skip, top)
      Enumerator.new do |y|
        until genes.empty?
          skip += genes.size
          genes.each { |gene| y << gene }
          genes = send_query(category, skip, top)
        end
      end
    end

    private

    module PharosApi
      endpoint = 'https://pharos-api.ncats.io/graphql'
      HTTP = GraphQL::Client::HTTP.new(endpoint) do
        def headers(_context)
          { 'User-Agent': 'DGIdb.org Pharos importer' }
        end
      end

      Schema = GraphQL::Client.load_schema(HTTP)
      Client = GraphQL::Client.new(schema: Schema, execute: HTTP)
    end

    Query = PharosApi::Client.parse <<-GRAPHQL
      query($filter: IFilter, $skip: Int, $top: Int) {
        targets(filter: $filter) {
          targets(skip: $skip, top: $top) {
            uniprot
            name
            sym
            fam
            preferredSymbol
          }
        }
      }
    GRAPHQL

    def send_query(category, skip, top)
      response = PharosApi::Client.query(Query, variables: {
        'filter': {
          'term': category
        },
        'skip': skip,
        'top': top
      })
      response.data.targets.targets
    end
  end
end; end; end; end
