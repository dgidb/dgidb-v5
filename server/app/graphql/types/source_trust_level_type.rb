module Types
  class SourceTrustLevelType < Types::BaseObject
    field :id, ID, null: false
    field :level, String, null: false
    field :sources, [Types::SourceType], null: true 
  end
end
