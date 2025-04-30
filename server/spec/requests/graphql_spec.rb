require 'rails_helper'

RSpec.describe 'GraphQL Endpoint', type: :request do
  let(:graphql_endpoint) { '/api/graphql' }

  around do |test_case|
    Rails.application.config.analytics_enabled = true
    test_case.run
    Rails.application.config.analytics_enabled = false
  end

  schema_query = {
    query: <<-GRAPHQL
      {
        __schema {
          queryType {
            name
          }
        }
      }
    GRAPHQL
  }

  simple_query = {
    query: <<-GRAPHQL
    {
      drugs(first: 1) {
        edges {
          node {
            name
          }
        }
      }
    }
    GRAPHQL
  }

  it 'responds with 200 for a schema query from the frontend' do
    headers = {
      'CONTENT_TYPE' => 'application/json',
      'dgidb-client-name' => 'dgidb-frontend'
    }

    post(graphql_endpoint, params: schema_query.to_json, headers:)

    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq('application/json; charset=utf-8')
  end

  it 'responds with 200 for a simple query from the frontend' do
    headers = {
      'CONTENT_TYPE' => 'application/json',
      'dgidb-client-name' => 'dgidb-frontend'
    }

    post(graphql_endpoint, params: simple_query.to_json, headers:)

    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq('application/json; charset=utf-8')
  end

  it 'responds with 200 for a schema query from the API' do
    post graphql_endpoint, params: schema_query.to_json, headers: { 'CONTENT_TYPE' => 'application/json' }

    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq('application/json; charset=utf-8')
  end

  it 'responds with 200 for a simple query from the API' do
    post graphql_endpoint, params: simple_query.to_json, headers: { 'CONTENT_TYPE' => 'application/json' }

    expect(response).to have_http_status(:ok)
    expect(response.content_type).to eq('application/json; charset=utf-8')
  end
end
