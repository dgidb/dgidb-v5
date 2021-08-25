module Types
    class GeneClaimType < Types::BaseObject
      field :id, String, null: false
      field :name, String, null: false
      field :nomenclature, String, null: false
      field :source_id, String, null: false
      field :gene_id, String, null: false
    end
  end
  