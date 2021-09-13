module Types
  class DrugType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :approved, Boolean, null: true
    field :immunotherapy, Boolean, null: true
    field :anti_neoplastic, Boolean, null: true
    field :concept_id, ID, null: false

    field :drug_claims, [Types::DrugClaimType], null: true
    field :interactions, [Types::InteractionType], null: true
    field :drug_aliases, [Types::DrugAliasType], null: true
    field :drug_attributes, [Types::DrugAttributeType], null: true
  end
end
