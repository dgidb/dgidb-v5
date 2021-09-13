module Types
  class GeneClaimType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :nomenclature, String, null: false
    field :source_id, ID, null: false
    field :gene_id, ID, null: false
  end
end
