require "graphql/client"
require "graphql/client/http"
require 'open-uri'

module Genome; module Importers; module ApiImporters; module Pharos;
  class ApiClient
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
      ENDPOINT = 'https://pharos-api.ncats.io/graphql'
      HTTP = GraphQL::Client::HTTP.new(ENDPOINT) do
        def headers(_context)
          { 'User-Agent': 'DGIdb.org Pharos importer' }
        end
      end

      class << self
        def client
          initialize_client
          const_get(:Client, false) if const_defined?(:Client, false)
        end

        def query
          initialize_client
          const_get(:Query, false) if const_defined?(:Query, false)
        end

        private

        def initialize_client
          return if const_defined?(:Client, false) && const_defined?(:Query, false)

          schema = GraphQL::Client.load_schema(HTTP)
          client = GraphQL::Client.new(schema:, execute: HTTP)
          query = client.parse <<-GRAPHQL
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
          const_set(:Schema, schema)
          const_set(:Client, client)
          const_set(:Query, query)
        rescue StandardError => e
          Rails.logger.warn("Error initializing Pharos GraphQL client: #{e.message}")
          remove_client_constants
        end

        def remove_client_constants
          %i[Schema Client Query].each do |constant|
            remove_const(constant) if const_defined?(constant, false)
          end
        end
      end
    end


    def send_query(category, skip, top)
      client = PharosApi.client
      query = PharosApi.query
      return [] unless client && query

      response = client.query(query, variables: {
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
