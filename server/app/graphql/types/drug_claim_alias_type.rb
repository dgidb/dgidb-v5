module Types
  class DrugClaimAliasType < Types::BaseObject
    field :id, ID, null: false
    field :drug_claim_id, ID, null: false
    field :alias, String, null: false
    field :nomenclature, String, null: false 
    field :drug_claim, Types::DrugClaimType, null: false
  end
end
