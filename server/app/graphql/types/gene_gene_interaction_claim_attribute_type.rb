module Types
  class GeneGeneInteractionClaimAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :gene_gene_interaction_claim_id, String, null: false
    field :name, String, null: false
    field :value, String, null: false
  end
end
