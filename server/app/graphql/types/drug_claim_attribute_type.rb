module Types
  class DrugClaimAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :drug_claim_id, String, null: false
    field :name, String, null: false
    field :value, String, null: false
    ## uncomment when implemented
    #field :drug_claim, Types::DrugClaimType, null: false
  end
end
