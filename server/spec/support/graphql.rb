module GraphQLHelpers
  def execute_graphql(query, **kwargs)
    DgidbSchema.execute(query, **kwargs)
  end
end

RSpec.configure do |c|
  c.include GraphQLHelpers, type: :graphql
end
