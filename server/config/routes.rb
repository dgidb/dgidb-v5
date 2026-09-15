Rails.application.routes.draw do
  post '/api/graphql', to: 'graphql#execute'
  post '/api/graphql/download/:table_name', to: 'table_download#download_table'

  get '/api/counts', to: 'counts#index'

  mount GraphiQL::Rails::Engine, at: '/api/graphiql', graphql_path: '/api/graphql'

  if ENV['DGIDB_CONTAINER'].present?
    get '/up', to: 'rails/health#show', as: :rails_health_check
    root 'spa#index'
    get '*path', to: 'spa#index', constraints: lambda { |request|
      request.get? && request.format.html? &&
        !request.path.start_with?('/api/', '/rails/')
    }
  end
end
