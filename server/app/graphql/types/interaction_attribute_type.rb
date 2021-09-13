module Types
  class InteractionAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :interaction_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false
    field :interaction, Types::InteractionType, null: false
    field :sources, [Types::SourceType], null: true
  end
end
