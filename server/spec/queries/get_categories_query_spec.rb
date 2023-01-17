require 'rails_helper'

# TODO
# Write some harsher tests to check edge cases of the resolver methods
RSpec.describe 'Get Categories Queries', type: :graphql do
  before(:example) do
    @src = create(:source)
    @cat = create(:gene_claim_category)
    @gene = create(:gene, gene_categories: [@cat])
    @gene_claim = create(:gene_claim, gene: @gene, source: @src, gene_claim_categories: [@cat])
  end

  let :get_categories_query do
    <<-GRAPHQL
    query genes($names: [String!]!) {
      genes(name: $names) {
        name
        geneCategoriesWithSources {
          name
          sourceNames
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getGeneRecordQuery correctly' do
    result = execute_graphql(get_categories_query, variables: { names: [@gene.name] })
    genes = result['data']['genes']
    expect(genes.size).to eq 1
    expect(genes[0]['name']).to eq @gene.name

    expect(genes[0]['geneCategoriesWithSources'].size).to eq 1
    cat = genes[0]['geneCategoriesWithSources'][0]
    expect(cat['name']).to eq @cat.name
    expect(cat['sourceNames']).to eq [@src.source_db_name]
  end

  let :get_categories_by_source_query do
    <<-GRAPHQL
    query categories($names: [String!]!) {
      genes(name: $names) {
        geneCategories {
          name
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getCategoriesBySourceQuery correctly' do
    result = execute_graphql(get_categories_by_source_query, variables: { names: [@gene.name] })
    expect(result['data']['genes'].size).to eq 1

    gene = result['data']['genes'][0]
    expect(gene['geneCategories'].size).to eq 1
    expect(gene['geneCategories'][0]['name']).to eq @cat.name
  end
end

