module Types
  class InteractionClaimTypeType < Types::BaseObject
    field :id, ID, null: false
    field :type, String, null: true
    field :directionality, Int, null: true
    field :definition, String, null: true
    field :reference, String, null: true
    field :interaction_claims, [Types::InteractionClaimType], null: false
    field :interactions, [Types::InteractionType], null: false

    def interaction_claims
      Loaders::AssociationLoader.for(::InteractionClaimType, :interaction_claims).load(object)
    end

    def interactions
      Loaders::AssociationLoader.for(::InteractionClaimType, :interactions).load(object)
    end
  end
end
