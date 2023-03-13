module Types
  class GeneAliasType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, ID, null: false
    field :alias, String, null: false, resolver_method: :resolve_alias

    field :gene, Types::GeneType, null: false
    field :sources, [Types::SourceType], null: false

    def gene
      Loaders::RecordLoader.for(Gene).load(object.gene_id)
    end

    def resolve_alias
      object.alias
    end

    def sources
      Loaders::AssociationLoader.for(GeneAlias, :sources).load(object)
    end
  end
end
