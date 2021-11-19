require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Drugs < GraphQL::Schema::Resolver

  include SearchObject.module(:graphql)

  type Types::DrugType.connection_type, null: false

  scope { Drug.all }

  option(:id, type: ID, description: 'Exact match filtering on the ID of the drug.') do |scope, value|
    scope.where(id: value)
  end

  option(:name, type: String, description: 'Substring filtering on drug name.') do |scope, value|
    scope.where("name ILIKE ?", "%#{value}%")
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


end