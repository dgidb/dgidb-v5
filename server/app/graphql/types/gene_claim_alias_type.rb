module Types
  class GeneClaimAliasType < Types::BaseObject
    field :id, ID, null: false
    field :gene_claim_id, ID, null: false
    field :alias, String, null: false
    field :nomenclature, String, null: false

    field :gene_claim, Types::GeneClaimType, null: false
  end
end
