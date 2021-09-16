module Types
  class InteractionClaimType < Types::BaseObject
    field :id, ID, null: false
    field :drug_claim_id, ID, null: false
    field :gene_claim_id, ID, null: false
    field :source_id, ID, null: true
    field :interaction_id, ID, null: true
    field :interaction_claim_attributes, [Types::InteractionClaimAttributeType], null: false
    field :interaction_claim_links, [Types::InteractionClaimLinkType], null: false
    field :gene_claim, Types::GeneClaimType, null: false
    field :drug_claim, Types::DrugClaimType, null: false
    field :source, Types::SourceType, null: true
    field :interaction_claim_types, [Types::InteractionClaimTypeType], null: false
    field :interaction, Types::InteractionType, null: true
    field :publications, [Types::PublicationType], null: false

    def interaction_claim_attributes
      Loaders::AssociationLoader.for(InteractionClaim, :interaction_claim_attributes).load(object)
    end

    def interaction_claim_links
      Loaders::AssociationLoader.for(InteractionClaim, :interaction_claim_links).load(object)
    end

    def gene_claim
      Loaders::RecordLoader.for(GeneClaim).load(object.gene_claim_id)
    end

    def drug_claim
      Loaders::RecordLoader.for(DrugClaim).load(object.drug_claim_id)
    end

    def source
      Loaders::RecordLoader.for(Source).load(object.source_id)
    end

    def interaction_claim_types
      Loaders::AssociationLoader.for(InteractionClaim, :interaction_claim_types).load(object)
    end

    def interaction
      Loaders::RecordLoader.for(Interaction).load(object.interaction_id)
    end

    def publications
      Loaders::AssociationLoader.for(InteractionClaim, :publications).load(object)
    end
  end
end
