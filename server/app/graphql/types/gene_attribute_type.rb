module Types
  class GeneAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false

    field :gene, Types::GeneType, null: false
    field :sources, [Types::SourceType], null: false
  end
end
