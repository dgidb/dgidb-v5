module Types
  class GeneClaimType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :nomenclature, String, null: false
    field :source_id, ID, null: false
    field :gene_id, ID, null: false

    field :gene, Types::GeneType, null: false
    field :gene_claim_categories, [Types::GeneClaimCategoryType], null: false
    field :gene_claim_aliases, [Types::GeneClaimAliasType], null: true
    field :gene_claim_attributes, [Types::GeneClaimAttributeType], null: true
    field :source, Types::SourceType, null: false
    field :interaction_claims, [Types::InteractionClaimType], null: true
    field :drug_claims, [Types::DrugClaimType], null: true
  end
end
