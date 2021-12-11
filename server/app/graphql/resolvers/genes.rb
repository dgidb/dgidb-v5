require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Genes < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::GeneType.connection_type, null: false

  scope { Gene.all }

  option(:id, type: ID) { |scope, value| scope.where(id: value)}
  option(:name, type: String) { |scope, value| scope.where("name ILIKE ?", "#{value}%")}
  option(:long_name, type: String) { |scope, value| scope.where("long_name ILIKE?", "#{value}%")}
  option(:entrez_id, type: Int) { |scope, value| scope.where(entrez_id: value)}

  # gene claim catagory by name
  option(:gene_claim_catagory, type: String, description: "Filtering on gene claim catagory name.") do |scope, value|
    #scope.joins(:gene_categories)
    #.joins('INNER JOIN gene_claim_categories ON gene_categories_genes.gene_claim_category_id = gene_claim_categories.id')
    #.where('gene_claim_category.name = ?', value)
    scope.joins(gene_claims: :gene_claim_categories).where('gene_claim_categories.name = ?', value)
  end

  # source full name, source db name, publication pmid, interaction type
  option(:)

  # search filters (Clinically Actionable, Druggable Genome, Drug Resistance)

end
