require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Categories < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::GeneClaimCategoryType.connection_type, null: false

  scope { GeneClaimCategory.all }

  option(:source_db_names, type: [String], description: 'Filtering on sources.') do |scope, value|
    scope.joins(gene_claims: [:source]).where('sources.source_db_name': value).distinct
  end

  option(:category_name, type: [String], description: 'Filtering on category name.') do |scope, value|
    scope.where(name: value).distinct
  end

  option(:name, type: String, description: 'Left anchored string search on category name') do |scope, value|
    scope.where('gene_claim_categories.name ILIKE ?', "#{value}%").distinct
  end
end
