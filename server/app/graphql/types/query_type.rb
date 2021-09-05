module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :source, Types::SourceType, null: true do
      argument :id, String, required: true
    end

    def source(id:)
      Source.find_by(id: id)
    end

    field :gene_claim, Types::GeneClaimType, null: true do
      argument :id, String, required: true
    end

    def gene_claim(id:)
      GeneClaim.find_by(id: id)
    end

    field :drug_alias, Types::DrugAliasType, null: true do
      argument :id, String, required: true
    end
    
    def drug_alias(id:)
      DrugAlias.find_by(id: id)
    end
  end
end
