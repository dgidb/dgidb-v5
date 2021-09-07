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

    def gene(name: )
      Gene.find_by(name: name)
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

    def gene_attribute(name: )
      GeneAttribute.find_by(name: name)
    end

    field :gene_attribute, Types::GeneAttributeType, null: true do
      argument :name, String, required: true
    end

    def gene_claim_attribute(name: )
      GeneClaimAttribute.find_by(name: name)
    end

    field :gene_claim_attribute, Types::GeneClaimAttributeType, null: true do
      argument :name, String, required: true
    end

    def gene_claim_alias(alias_name: )
      GeneClaimAlias.find_by(alias: alias_name)
    end

    field :gene_claim_alias, Types::GeneClaimAliasType, null: true do
      argument :alias_name, String, required: true
    end

    # def gene_claim_category(name: )
    #   GeneClaimCategory.find_by(name: name)
    # end

    # field :gene_claim_category, Types::GeneClaimCategoryType, null: true do
    #   arugment :name, String, required: true
    # end

  end
end
