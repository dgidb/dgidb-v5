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

    field :drug_attribute, Types::DrugAttributeType, null: true do
      description "Attribute(s) associated with with a drug"
      argument :id, ID, required: true
    end

    def drug_attribute(id:)
      DrugAttribute.find_by(id: id)
    end

    field :drug_claim_alias, Types::DrugClaimAliasType, null: true do
      description "Alias for a drug claim"
      argument :id, ID, required: true
    end
    
    def drug_claim_alias(id:)
      DrugClaimAlias.find_by(id: id)
    end

    field :drug_claim_attribute, Types::DrugClaimAttributeType, null: true do
      description "Attributes for a claim on a drug"
      argument :id, ID, required: true
    end 

    def drug_claim_attribute(id:)
      DrugClaimAttribute.find_by(id: id)
    end

    field :drug_claim_type, Types::DrugClaimTypeType, null: true do
      description "Types of drug claims"
      argument :id, ID, required: true
    end

    def drug_claim_type(id:)
      DrugClaimType.find_by(id: id)
    end

    field :drug_claim, Types::DrugClaimType, null: true do
      description "A claim for a drug"
      argument :id, ID, required: true
    end

    def drug_claim(id:)
      DrugClaim.find_by(id: id)
    end

    field :drug, Types::DrugType, null: true do
      description "A drug"
      argument :id, ID, required: true
    end

    def drug(id:)
      Drug.find_by(id: id)
    end
  end
end
