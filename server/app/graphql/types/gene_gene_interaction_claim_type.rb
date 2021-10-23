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

    def source
      Loaders::RecordLoader.for(Source).load(object.source_id)
    end

    def interacting_gene
      Loaders::RecordLoader.for(Gene).load(object.interacting_gene_id)
    end

    def gene
      Loaders::RecordLoader.for(Gene).load(object.gene_id)
    end

    def gene_gene_interaction_claim_attributes
      Loaders::AssociationLoader.for(GeneGeneInteractionClaim, :gene_gene_interaction_claim_attributes).load(object)
    end
  end
end
