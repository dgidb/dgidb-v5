module Types
  class DrugAliasType < Types::BaseObject
    field :id, ID, null: false
    field :alias, String, null: false
    field :drug_id, String, null: false
    field :drug, Types::DrugType, null: false
    field :sources, [Types::SourceType], null: false
  end
end
