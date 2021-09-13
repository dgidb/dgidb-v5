module Types
  class GeneGeneInteractionClaimType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, ID, null: false
    field :interacting_gene_id, ID, null: false
    field :source_id, ID, null: false
  end
end
