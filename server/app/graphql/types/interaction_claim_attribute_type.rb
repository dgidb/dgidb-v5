module Types
  class InteractionClaimAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :interaction_claim_id, String, null: false
    field :name, String, null: false
    field :value, String, null: false
    field :interaction_claim, Types::InteractionClaimType, null: false
  end
end
