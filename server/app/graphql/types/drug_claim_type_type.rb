module Types
  class DrugClaimTypeType < Types::BaseObject
    field :id, ID, null: false
    field :type, String, null: false
    #field :drug_claim, Types::DrugClaimType, null: false
  end
end
