module Types
  class DrugAliasType < Types::BaseObject
    field :id, ID, null: false
    field :alias, String, null: false, resolver_method: :resolve_alias
    field :drug_id, ID, null: false
    field :drug, Types::DrugType, null: false
    field :sources, [Types::SourceType], null: false

    def drug
      Loaders::RecordLoader.for(Drug).load(object.drug_id)
    end

    def resolve_alias
      object.alias
    end

    def sources
      Loaders::AssociationLoader.for(DrugAlias, :sources).load(object)
    end
  end
end
