module Types
  class GeneGeneInteractionClaimType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, String, null: false
    field :interacting_gene_id, String, null: false
    field :source_id, String, null: false
  end
end
