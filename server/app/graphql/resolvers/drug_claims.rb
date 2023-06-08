require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::DrugClaims < GraphQL::Schema::Resolver

  include SearchObject.module(:graphql)

  type Types::DrugClaimType.connection_type, null: false

  scope { DrugClaim.all.distinct }

  option(:source_db_name, type: String, description: 'Exact filtering on full name of source for drug claim.') do |scope, value|
    scope.joins(:source).where("sources.source_db_name = ?", value)
  end
end
