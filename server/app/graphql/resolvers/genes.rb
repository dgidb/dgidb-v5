require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Genes < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::GeneType.connection_type, null: false

  scope { Gene.all.distinct }

  option(:ids, type: [String], description: 'Exact match filtering on a list of gene UUIDs') do  |scope, value|
    scope.where(id: value)
  end
  option(:names, type: [String], description: 'Substring filtering on a list of gene names.') do  |scope, value|
    scope.where(name: value.map(&:upcase))
  end
  option(:long_name, type: String, description: 'Left anchored string search on long gene name.') do  |scope, value|
    scope.where("long_name ILIKE?", "#{value}%")
  end
  option(:concept_id, type: String, description: 'Exact match filtering on concept ID.') do  |scope, value|
    scope.where(concept_id: value)
  end
  option(:concept_ids, type: [String], description: 'Exact match filtering on a list of concept IDs') do  |scope, value|
    scope.where(concept_id: value)
  end

  option(:name, type: String, description: 'Left anchored string search on gene symbol') do |scope, value|
    scope.where('name ILIKE ?', "#{value.upcase}%")
  end

  # TODO: search filters (Clinically Actionable, Druggable Genome, Drug Resistance)

  # gene claim category by name
  option(:gene_claim_category, type: [String], description: "Filtering on gene claim category name.") do |scope, values|
    lowercase_values = values.map(&:downcase)
    scope.joins(gene_claims: :gene_claim_categories).where('LOWER(gene_claim_categories.name) IN (?)', lowercase_values)
  end

  option(:interaction_type, type: String, description: 'Exact filtering on interaction claim type.') do |scope, value|
    scope.joins(interactions: :interaction_types).where("interaction_claim_types.type = ?", value)
  end

  option(:source_name, type: String, description: 'Exact filtering on full name of source for an interaction.') do |scope, value|
    scope.joins(interactions: :sources).where("sources.full_name ILIKE ?", "%#{value}%")
  end

  option(:source_db_name, type: String, description: 'Exact filtering of source db name for an interaction') do |scope, value|
    scope.joins(interactions: :sources).where("sources.source_db_name ILIKE ?", "%#{value}%")
  end

  option(:pmid, type: Int, description: 'Exact match filtering on publication pmids.') do |scope, value|
    scope.joins(interactions: :publications).where("publications.pmid = ?", value)
  end
end
