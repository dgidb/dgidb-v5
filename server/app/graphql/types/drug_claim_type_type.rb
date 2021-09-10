module Types
  class DrugClaimTypeType < Types::BaseObject
    field :id, ID, null: false
    field :type, String, null: false
    field :drug_claims, [Types::DrugClaimType], null: false
  end
end
