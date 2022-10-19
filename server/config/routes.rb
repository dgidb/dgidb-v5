Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute"

  get '/api/health_check', to: proc { [200, {}, ['success']] } unless Gene.first.nil?

  if Rails.env.development?
    mount GraphQL::Playground::Engine, at: "/api/graphiql", graphql_path: "/api/graphql"
  end
end
