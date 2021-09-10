module Types
  class PublicationType < Types::BaseObject
    field :id, ID, null: false
    field :pmid, Integer, null: false
    field :citation, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: true
    field :interactions, [Types::InteractionType], null: true
    field :interaction_claims, [Types::InteractionClaimType], null: true
  end
end
