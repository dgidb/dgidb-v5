module Types
  class GeneAliasType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, String, null: false
    field :alias, String, null: false
  end
end
