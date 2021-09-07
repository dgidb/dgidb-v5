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
      ModelTypes::DrugClaimType.find id
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

    field :interaction_attribute, Types::InteractionAttributeType, null: true do
      description "An attribute of an interaction"
      argument :id, ID, required: true
    end

    def interaction_attribute(id:)
      InteractionAttribute.find_by(id: id)
    end

    field :interaction_claim_attribute, Types::InteractionClaimAttributeType, null: true do
      description "An attribute of an interaction claim"
      argument :id, ID, required: true
    end

    def interaction_claim_attribute(id:)
      InteractionClaimAttribute.find_by(id: id)
    end

    field :interaction_claim_link, Types::InteractionClaimLinkType, null: true do
      description "Links associated with an attribute claim"
      argument :id, ID, required: true
    end

    def interaction_claim_link(id:)
      InteractionClaimLink.find_by(id: id)
    end

    field :interaction_claim_type, Types::InteractionClaimTypeType, null: true do
      description "A type associated with an interaction claim"
      argument :id, ID, required: true
    end

    def interaction_claim_type(id:)
      InteractionClaimType.find id
    end

    field :interaction_claim, Types::InteractionClaimType, null: true do
      description "A claim on an interaction"
      argument :id, ID, required: true
    end

    def interaction_claim(id:)
      InteractionClaim.find_by(id: id)
    end

    field :interaction, Types::InteractionType, null: true do
      description "An interaction"
      argument :id, ID, required: true
    end

    def interaction(id:)
      Interaction.find_by(id: id)
    end
  end
end
