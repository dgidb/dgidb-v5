Rails.application.routes.draw do
  post "/api/graphql", to: "graphql#execute"
  post "/api/graphql/download/:table_name", to: "table_download#download_table"

  mount GraphiQL::Rails::Engine, at: "/api/graphiql", graphql_path: "/api/graphql"
end
