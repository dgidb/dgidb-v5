module Types
  class InteractionClaimTypeType < Types::BaseObject
    field :id, ID, null: false
    field :type, String, null: true
    field :directionality, Int, null: true
    field :definition, String, null: true
    field :reference, String, null: true
    field :interaction_claims, [Types::InteractionClaimType], null: true
    field :interactions, [Types::InteractionType], null: true
  end
end
