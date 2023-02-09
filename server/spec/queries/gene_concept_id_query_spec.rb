require 'rails_helper'

# Can probably be incorporated into the gene record lookup query once that's updated
RSpec.describe 'Gene concept ID Query', type: :graphql do
  before(:example) do
    @gene = create(:gene)
  end

  let :query do
    <<-GRAPHQL
    query gene($name: String!) {
      gene(name: $name) {
        name
        conceptId
      }
    }
    GRAPHQL
  end

  it 'should retrieve gene concept ID' do
    result = execute_graphql(query, variables: { name: @gene.name })
    expect(result['data']['gene']['name']).to eq @gene.name
    expect(result['data']['gene']['conceptId']).to eq @gene.concept_id
  end
end
