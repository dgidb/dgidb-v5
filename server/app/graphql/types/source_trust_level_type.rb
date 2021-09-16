module Types
  class SourceTrustLevelType < Types::BaseObject
    field :id, ID, null: false
    field :level, String, null: false
    field :sources, [Types::SourceType], null: false

    def sources
      Loaders::AssociationLoader.for(SourceTrustLevel, :sources).load(object)
    end
  end
end
