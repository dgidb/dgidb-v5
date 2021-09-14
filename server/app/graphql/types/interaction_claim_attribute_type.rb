module Types
  class InteractionClaimAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :interaction_claim_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false
    field :interaction_claim, Types::InteractionClaimType, null: false

    def interaction_claim
      Loaders::RecordLoader.for(InteractionClaim).load(object.interaction_claim_id)
    end
  end
end
