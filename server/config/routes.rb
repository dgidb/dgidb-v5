Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute"

  mount GraphiQL::Rails::Engine, at: "/api/graphiql", graphql_path: "/api/graphql"
end
