module Types
  class GeneClaimType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :nomenclature, String, null: false
    field :source_id, ID, null: false
    field :gene_id, ID, null: false

    field :gene, Types::GeneType, null: false
    field :gene_claim_categories, [Types::GeneClaimCategoryType], null: false
    field :gene_claim_aliases, [Types::GeneClaimAliasType], null: false
    field :gene_claim_attributes, [Types::GeneClaimAttributeType], null: false
    field :source, Types::SourceType, null: false
    field :interaction_claims, [Types::InteractionClaimType], null: false
    field :drug_claims, [Types::DrugClaimType], null: false

    def gene
      Loaders::RecordLoader.for(Gene).load(object.gene_id)
    end

    def gene_claim_categories
      Loaders::AssociationLoader.for(GeneClaim, :gene_claim_categories).load(object)
    end

    def gene_claim_aliases
      Loaders::AssociationLoader.for(GeneClaim, :gene_claim_aliases).load(object)
    end

    def gene_claim_attributes
      Loaders::AssociationLoader.for(GeneClaim, :gene_claim_attributes).load(object)
    end

    def source
      Loaders::RecordLoader.for(Source).load(object.source_id)
    end

    def interaction_claims
      Loaders::AssociationLoader.for(GeneClaim, :interaction_claims).load(object)
    end

    def drug_claims
      Loaders::AssociationLoader.for(GeneClaim, :drug_claims).load(object)
    end
  end
end
