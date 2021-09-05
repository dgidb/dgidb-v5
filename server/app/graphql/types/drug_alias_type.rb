module Types
  class DrugAliasType < Types::BaseObject
    field :id, String, null: false
    field :alias, String, null: true
    ## need to implemnt Drug active_record and DrugType
    # field :drug, Types::DrugType, null: false
    
    # I believe that I have this implemented correctly, thought the table for this
    # is empty
    field :sources, [Types::SourceType], null: true
  end
end
