module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.
    
    field :source, Types::SourceType, null: true do
      argument :id, String, required: true
    end

    def source(id: )
      Source.find_by(id: id)
    end
  end
end
