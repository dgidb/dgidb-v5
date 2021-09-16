module Types
  class InteractionAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :interaction_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false
    field :interaction, Types::InteractionType, null: false
    field :sources, [Types::SourceType], null: false

    def interaction
      Loaders::RecordLoader.for(Interaction).load(object.interaction_id)
    end

    def sources
      Loaders::AssociationLoader.for(InteractionAttribute, :sources).load(object)
    end
  end
end
