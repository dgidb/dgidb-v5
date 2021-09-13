module Types
  class DrugType < Types::BaseObject
    field :id, ID, null: false 
    field :name, String, null: false
    field :approved, Boolean, null: true
    field :immunotherapy, Boolean, null: true
    field :anti_neoplastic, Boolean, null: true
    field :concept_id, String, null: false

    field :drug_claims, [Types::DrugClaimType], null: true
    field :interactions, [Types::InteractionType], null: true
    field :drug_aliases, [Types::DrugAliasType], null: true
    field :drug_attributes, [Types::DrugAttributeType], null: true

    def drug_claims
      Loaders::AssociationLoader.for(Drug, :drug_claims).load(object)
    end

    def interactions
      Loaders::AssociationLoader.for(Drug, :interactions).load(object)
    end

    def drug_aliases
      Loaders::AssociationLoader.for(Drug, :drug_aliases).load(object)
    end

    def drug_attributes
      Loaders::AssociationLoader.for(Drug, :drug_attributes).load(object)
    end
  end
end
