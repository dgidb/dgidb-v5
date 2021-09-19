module Types
  class GeneAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false

    field :gene, Types::GeneType, null: false
    field :sources, [Types::SourceType], null: false

    def gene
      Loaders::RecordLoader.for(Gene).load(object.gene_id)
    end

    def sources
      Loaders::AssociationLoader.for(GeneAttribute, :sources).load(object)
    end
  end
end
