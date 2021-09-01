module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.
    
    field :source, Types::SourceType, null: true do
      argument :source_db_name, String, required: true
    end

    def source(source_db_name: )
      Source.find_by(source_db_name: source_db_name)
    end

    field :gene_claim, Types::GeneClaimType, null: true do
      argument :id, String, required: true
    end

    def gene_claim(id: )
      GeneClaim.find_by(id: id)
    end

    field :gene, Types::GeneType, null: true do
      argument :name, String, required: true
    end

    def gene_alias(id: )
      GeneAlias.find_by(id: id)
    end

    field :gene_alias, Types::GeneAliasType, null: true do
      argument :id, String, required: true
    end

    def gene(name: )
      Gene.find_by(name: name)
    end 

  end
end
