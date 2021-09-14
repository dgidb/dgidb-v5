module Types
  class GeneClaimType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :nomenclature, String, null: false
    field :source_id, ID, null: false
    field :gene_id, ID, null: false

    field :gene, Types::GeneType, null: false
    field :gene_claim_categories, [Types::GeneClaimCategoryType], null: false
    field :gene_claim_aliases, [Types::GeneClaimAliasType], null: false
    field :gene_claim_attributes, [Types::GeneClaimAttributeType], null: false
    field :source, Types::SourceType, null: false
    field :interaction_claims, [Types::InteractionClaimType], null: false
    field :drug_claims, [Types::DrugClaimType], null: false
  end
end
