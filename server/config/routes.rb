Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute"

  get '/health_check', to: proc { [200, {}, ['success']] }

  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/api/graphql"
end
