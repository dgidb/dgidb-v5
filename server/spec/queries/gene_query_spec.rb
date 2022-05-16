require 'rails_helper'

RSpec.describe 'Genes Query', type: :graphql do 
  before(:example) do
    @gene = create(:gene)
  end

  let :query do
    <<-GRAPHQL
    query($geneNames: [String!]!) {
      genes(name: $geneNames) {
        id
        name
      }
    }
    GRAPHQL
  end

  it 'should find a gene by name' do
    result = execute_graphql(query, variables: { geneNames: [@gene.name] })
    expect(result['data']['genes'].size).to eq 1
    expect(result['data']['genes'].first['id']).to eq @gene.id
    expect(result['errors']).to be_nil
  end
end
