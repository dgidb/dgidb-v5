module Types
  class GeneType < Types::BaseObject
  class CategoryWithSources < Types::BaseObject
    field :name, String, null: false
    field :source_names, [String], null: false
  end
    field :id, ID, null: false
    field :name, String, null: true
    field :long_name, String, null: true
    field :concept_id, String, null: true

    field :gene_claims, [Types::GeneClaimType], null: false
    field :interactions, [Types::InteractionType], null: false
    field :gene_aliases, [Types::GeneAliasType], null: false
    field :gene_attributes, [Types::GeneAttributeType], null: false
    field :gene_categories, [Types::GeneClaimCategoryType], null: false
    field :gene_categories_with_sources, [CategoryWithSources], null: false do
      argument :category_name, String, required: false
    end

    def gene_categories_with_sources (category_name: nil)
      if category_name
        GeneClaimCategory.joins(gene_claims: [:source, :gene]).where("genes.id =? ", object.id)
        .where('gene_claim_categories.name =?', category_name)
        .select("gene_claim_categories.name, array_agg(distinct(sources.source_db_name)) AS source_names")
        .group("gene_claim_categories.name")
      else
        GeneClaimCategory.joins(gene_claims: [:source, :gene]).where("genes.id =? ", object.id)
        .select("gene_claim_categories.name, array_agg(distinct(sources.source_db_name)) AS source_names")
        .group("gene_claim_categories.name")
      end
    end

    def gene_claims
      Loaders::AssociationLoader.for(Gene, :gene_claims).load(object)
    end

    def interactions
      Loaders::AssociationLoader.for(Gene, :interactions).load(object)
    end

    def gene_aliases
      Loaders::AssociationLoader.for(Gene, :gene_aliases).load(object)
    end

    def gene_attributes
      Loaders::AssociationLoader.for(Gene, :gene_attributes).load(object)
    end

    def gene_categories
      Loaders::AssociationLoader.for(Gene, :gene_categories).load(object)
    end
  end
end
