module Types
  class DrugAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false
    field :drug, Types::DrugType, null: false
    field :sources, [Types::SourceType], null: false
  end
end
