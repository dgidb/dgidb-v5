module Types
  class InteractionType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :gene_id, ID, null: false

    field :interaction_claims, [Types::InteractionClaimType], null: true
    field :gene, Types::GeneType, null: true
    field :drug, Types::DrugType, null: true
    field :interaction_types, [Types::InteractionClaimTypeType], null: true
    field :interaction_attributes, [Types::InteractionAttributeType], null: true
    field :publications, [Types::PublicationType], null: true
    field :sources, [Types::SourceType], null: true
  end
end
