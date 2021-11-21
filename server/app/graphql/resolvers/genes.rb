require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Genes < GraphQL::Schema::Resolver

    include SearchObject.module(:graphql)

    type Types::GeneType.connection_type, null: false

    scope { Gene.all }


    option(:name, type: String) { |scope, value| scope.where("name ILIKE ?", "#{value}%")}
    option(:long_name, type: String) { |scope, value| scope.where("long_name ILIKE?", "#{value}%")}
    option(:entrez_id, type: Int) { |scope, value| scope.where(entrez_id: value)}

end