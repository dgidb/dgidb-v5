module Types
  class SourceTypeType < Types::BaseObject
    field :id, ID, null: false
    field :type, String, null: true
    field :display_name, String, null: true
    field :sources, [Types::SourceType], null: false

    def sources
      Loaders::AssociationLoader.for(::SourceType, :sources).load(object)
    end
  end
end