require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Categories < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::GeneClaimCategoryType.connection_type, null: false

  scope { GeneClaimCategory.all }

  option(:source, type: String, description: 'Filtering on source.') do |scope, value|
    scope.where("name ILIKE ?", "%#{value}%")
  end

end
