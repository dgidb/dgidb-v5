Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute"

  get '/health_check', to: proc { [200, {}, ['success']] } unless Gene.first.nil?

  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/api/graphql"
end
