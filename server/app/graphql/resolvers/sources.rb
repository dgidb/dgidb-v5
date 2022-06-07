require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Sources < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::SourceType.connection_type, null: false

  scope { Source.all }

  class SourceTypeFilter < Types::BaseEnum
    value 'GENE', value: 'gene'
    value 'DRUG', value: 'drug'
    value 'INTERACTION', value: 'interaction'
    value 'POTENTIALLY_DRUGGABLE', value: 'potentially_druggable'
  end

  option(:source_type, type: SourceTypeFilter) { |scope, value| scope.joins(:source_types).where('source_types.type =? ', value)}

end
