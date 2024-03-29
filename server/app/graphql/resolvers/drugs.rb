require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Drugs < GraphQL::Schema::Resolver

  include SearchObject.module(:graphql)

  type Types::DrugType.connection_type, null: false

  scope { Drug.all.distinct }

  option(:ids, type: [String], description: 'Exact match filtering on a list of drug IDs') do |scope, value|
    scope.where(id: value)
  end

  option(:names, type: [String], description: 'Left anchored filtering on a list of drug names.') do |scope, value|
    text = 'name ILIKE ?'
    clause = Array.new(value.size, text).join(" OR ")
    scope.where(clause, *value.map {|v| "#{v}%"})
  end

  option(:name, type: String, description: 'Left anchored string search on drug name') do |scope, value|
    scope.where('drugs.name ILIKE ?', "#{value}%")
  end

  option(:approved, type: Boolean, description: 'Filtering on approval status of drug.') do |scope, value|
    scope.where(approved: value)
  end

  option(:immunotherapy, type: Boolean, description: 'Filtering on immunotherapy status of drug.') do |scope, value|
    scope.where(immunotherapy: value)
  end

  option(:anti_neoplastic, type: Boolean, description: 'Filtering on anti neoplasticity of drug.') do |scope, value|
    scope.where(anti_neoplastic: value)
  end

  option(:concept_id, type: String, description: 'Exact match filtering on concept ID.') do |scope, value|
    scope.where(concept_id: value)
  end

  option(:concept_ids, type: [String], description: 'Exact match filtering on a list of concept IDs') do |scope, value|
    scope.where(concept_id: value)
  end

  option(:interaction_type, type: String, description: 'Exact filtering on interaction claim type.') do |scope, value|
    scope.joins(interactions: :interaction_types).where("interaction_claim_types.type = ?", value)
  end

  option(:source_name, type: String, description: 'Exact filtering on full name of source for an interaction.') do |scope, value|
    scope.joins(interactions: :sources).where("sources.full_name = ?", value)
  end

  option(:source_db_name, type: String, description: 'Exact filtering of source db name for an interaction') do |scope, value|
    scope.joins(interactions: :sources).where("sources.source_db_name = ?", value)
  end

  option(:pmid, type: Int, description: 'Exact match filtering on publication pmids.') do |scope, value|
    scope.joins(interactions: :publications).where("publications.pmid = ?", value)
  end
end
