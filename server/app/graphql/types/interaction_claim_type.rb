module Types
  class InteractionClaimType < Types::BaseObject
    field :id, ID, null: false
    field :drug_claim_id, ID, null: false
    field :gene_claim_id, ID, null: false
    field :source_id, ID, null: true
    field :interaction_id, ID, null: true
    field :interaction_claim_attributes, [Types::InteractionClaimAttributeType], null: true
    field :interaction_claim_links, [Types::InteractionClaimLinkType], null: true
    field :gene_claim, Types::GeneClaimType, null: true
    field :drug_claim, Types::DrugClaimType, null: true
    field :source, Types::SourceType, null: true
    field :interaction_claim_types, [Types::InteractionClaimTypeType], null: true
    field :interaction, Types::InteractionType, null: true
    field :publications, [Types::PublicationType], null: true
  end
end
