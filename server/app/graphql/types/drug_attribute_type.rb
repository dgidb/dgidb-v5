module Types
  class DrugAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, String, null: false
    field :name, String, null: false
    field :value, String, null: false
    ## Uncomment this when DrugType is implemented
    # field :drug, Types::DrugType, null: false
    field :sources, [Types::SourceType], null: false
  end
end
