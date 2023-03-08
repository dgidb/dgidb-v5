require 'rails_helper'

RSpec.describe 'Gene counts for categories query', type: :graphql do
  before(:example) do
    @source1 = create(:source)
    @source2 = create(:source)
    @source3 = create(:source)
    @cat1 = create(:gene_claim_category)
    @cat2 = create(:gene_claim_category)
    @gene1 = create(:gene, gene_categories: [@cat1])
    @gc1 = create(:gene_claim, source: @source1, gene_claim_categories: [@cat1], gene: @gene1)
    @gc2 = create(:gene_claim, source: @source2, gene_claim_categories: [@cat1], gene: @gene1)
    @gene2 = create(:gene, gene_categories: [@cat1, @cat2])
    @gc3 = create(:gene_claim, source: @source3, gene_claim_categories: [@cat1], gene: @gene2)
    @gc4 = create(:gene_claim, source: @source1, gene_claim_categories: [@cat2], gene: @gene2)
  end

  let :query do
    <<-GRAPHQL
    query categories($sourceDbNames:[String!]!) {
      categories(sourceDbNames:$sourceDbNames) {
        nodes {
          name
          geneCount(sourceDbNames:$sourceDbNames)
        }
      }
    }
    GRAPHQL
  end

  it 'should handle multiple gene claims under same gene correctly' do
    result = execute_graphql(
      query,
      variables: {
        sourceDbNames: [
          @source1.source_db_name,
          @source2.source_db_name,
          @source3.source_db_name
        ]
      }
    )
    nodes = result['data']['categories']['nodes']
    expect(nodes.size).to eq 2
    cat1 = nodes.select { |n| n['name'] == @cat1.name }[0]
    expect(cat1).to be
    expect(cat1['geneCount']).to eq 2
    cat2 = nodes.select { |n| n['name'] == @cat2.name }[0]
    expect(cat2).to be
    expect(cat2['geneCount']).to eq 1
  end

  it 'should not count categories from unrequested sources' do
    result = execute_graphql(
      query,
      variables: {
        sourceDbNames: [
          @source2.source_db_name,
          @source3.source_db_name,
        ]
      }
    )
    nodes = result['data']['categories']['nodes']
    expect(nodes.size).to eq 1
    expect(nodes[0]['name']).to eq @cat1.name
    expect(nodes[0]['geneCount']).to eq 2
  end

  it 'should not count genes from unrequested sources' do
    result = execute_graphql(query, variables: { sourceDbNames: [@source3.source_db_name] })
    expect(result['data']['categories']['nodes'].size).to eq 1
    cat1 = result['data']['categories']['nodes'][0]
    expect(cat1['name']).to eq @cat1.name
    expect(cat1['geneCount']).to eq 1
  end
end
