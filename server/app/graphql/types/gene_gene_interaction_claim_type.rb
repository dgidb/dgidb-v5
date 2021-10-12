module Types
  class GeneGeneInteractionClaimType < Types::BaseObject
    field :id, ID, null: false
    field :gene_id, ID, null: false
    field :interacting_gene_id, ID, null: false
    field :source_id, ID, null: false

    field :source, Types::SourceType, null: false
    field :interacting_gene, Types::GeneType, null: false
    field :gene, Types::GeneType, null: false
    field :gene_gene_interaction_claim_attributes, [Types::GeneGeneInteractionClaimAttributeType], null: false
  end
end
