module Types
  class GeneGeneInteractionClaimAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :gene_gene_interaction_claim_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false

    field :gene_gene_interaction_claim, Types::GeneGeneInteractionClaimType, null: false

    def gene_gene_interaction_claim
      Loaders::RecordLoader.for(GeneGeneInteractionClaim).load(object.gene_gene_interaction_claim_id)
    end
  end
end
