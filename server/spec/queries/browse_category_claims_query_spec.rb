require 'rails_helper'

RSpec.describe 'Browse Category Claims Query', type: :graphql do
  before(:example) do
    @cat1 = create(:gene_claim_category)
    @cat2 = create(:gene_claim_category)
    @src1 = create(:source)
    @src2 = create(:source)
    @src3 = create(:source)
    @gene1 = create(:gene, gene_categories: [@cat1])
    @gene2 = create(:gene, gene_categories: [@cat1, @cat2])
    @claim1 = create(:gene_claim, source: @src1, gene: @gene1, gene_claim_categories: [@cat1])
    @claim2 = create(:gene_claim, source: @src2, gene: @gene1, gene_claim_categories: [@cat1])
    @claim3 = create(:gene_claim, source: @src3, gene: @gene1, gene_claim_categories: [@cat1])
    @claim4 = create(:gene_claim, source: @src1, gene: @gene2, gene_claim_categories: [@cat2])
    @claim5 = create(:gene_claim, source: @src1, gene: @gene2, gene_claim_categories: [@cat1])
  end

  let :query do
    <<-GRAPHQL
    query geneClaimCategory($categoryName: String!, $sourceDbNames: [String!]!) {
      geneClaimCategory(name: $categoryName) {
        name
        genes(categoryName: $categoryName, sourceNames: $sourceDbNames) {
          edges {
            node {
              name
              conceptId
              longName
              sourceDbNames
            }
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getClaimsForCategory correctly' do
    source_names = [@src1.source_db_name, @src2.source_db_name]
    result = execute_graphql(query, variables: {categoryName: @cat1.name, sourceDbNames: source_names})
    cat = result['data']['geneClaimCategory']
    expect(cat['name']).to eq @cat1.name

    expect(cat['genes']['edges'].size).to eq 2

    gene1 = cat['genes']['edges'].select { |g| g['node']['name'] == @gene1.name }[0]['node']
    expect(gene1).to be
    expect(gene1['conceptId']).to eq @gene1.concept_id
    expect(gene1['sourceDbNames'].sort).to eq source_names.sort

    gene2 = cat['genes']['edges'].select { |g| g['node']['name'] == @gene2.name }[0]['node']
    expect(gene2).to be
    expect(gene2['conceptId']).to eq @gene2.concept_id
    expect(gene2['sourceDbNames'].sort).to eq [@src1.source_db_name]
  end
end
