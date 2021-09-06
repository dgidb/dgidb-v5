module Types
  class DrugClaimType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :nomenclature, String, null: false
    field :source_id, String, null: true
    field :primary_name, String, null: true
    field :drug_id, String, null: true

    # field :drug, Types::DrugType, null: false
    field :drug_claim_aliases, [Types::DrugClaimAliasType], null: true
    # field :interaction_claim, Types::InteractionClaimType, null: true
    field :gene_claims, [Types::GeneClaimType], null: true
    field :source, Types::SourceType, null: true
    field :drug_claim_attributes, [Types::DrugClaimAttributeType], null: true
    field :drug_claim_types, [Types::DrugClaimTypeType], null: true
  end
end
