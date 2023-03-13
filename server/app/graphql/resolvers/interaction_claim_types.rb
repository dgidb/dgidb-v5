require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::InteractionClaimTypes < GraphQL::Schema::Resolver

  include SearchObject.module(:graphql)

  type Types::InteractionClaimTypeType.connection_type, null: false

  scope { InteractionClaimType.all }

end
