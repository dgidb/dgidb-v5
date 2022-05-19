Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute"

  get '/api/health_check', to: proc { [200, {}, ['success']] } unless Gene.first.nil?

  mount GraphiQL::Rails::Engine, at: "/api/graphiql", graphql_path: "/api/graphql"
end
