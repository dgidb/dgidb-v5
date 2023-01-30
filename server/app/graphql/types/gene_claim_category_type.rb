module Types
  class GeneClaimCategoryType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false

    field :gene_claims, [Types::GeneClaimType], null: false

    def gene_claims
      Loaders::AssociationLoader.for(GeneClaimCategory, :gene_claims).load(object)
    end

    class GeneCategoryResult < Types::BaseObject
      field :name, String, null: false
      field :concept_id, String, null: false
      field :long_name, String, null: true
      field :source_db_names, [String],  null: false
    end

    field :genes, GeneCategoryResult.connection_type, null: false do
      argument :source_names, [String], required: false
    end


    def genes(source_names: [], category_name: '')
      if category_name.empty? && !context[:category_name].nil?
        category_name = context[:category_name]
      end

      query = GeneClaim.select('genes.name, genes.concept_id, genes.long_name, array_agg(DISTINCT sources.source_db_name) AS source_db_names')
         .joins('LEFT JOIN sources ON sources.id = gene_claims.source_id')
         .joins('RIGHT JOIN gene_claim_categories_gene_claims ON gene_claims.id = gene_claim_categories_gene_claims.gene_claim_id')
         .joins('LEFT JOIN gene_claim_categories ON gene_claim_categories.id = gene_claim_categories_gene_claims.gene_claim_category_id')
         .joins('LEFT JOIN genes ON genes.id = gene_claims.gene_id')
         .where(gene_claim_categories: { name: category_name })
         .group(['genes.name', 'genes.concept_id', 'genes.long_name'])
         .where.not('genes.name': nil)

      if source_names.any?
        query.where(sources: {source_db_name: source_names})
      else
        query
      end
    end
  end
end
