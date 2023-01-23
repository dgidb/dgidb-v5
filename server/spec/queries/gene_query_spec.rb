require 'rails_helper'

RSpec.describe 'Genes Query', type: :graphql do
  before(:example) do
    @src = create(:source)
    @gene_claim = create(:gene_claim, source: @src)
    @gene_attr = create(:gene_attribute)
    @gene_alias = create(:gene_alias)
    @gene_cat = create(:gene_claim_category)
    @gene = create(:gene, gene_attributes: [@gene_attr], gene_aliases: [@gene_alias], gene_claims: [@gene_claim], gene_categories: [@gene_cat])
  end

  let :query do
    <<-GRAPHQL
    query gene($name: String!) {
      gene(name: $name) {
        conceptId
        geneAttributes {
          geneId
          gene {
            longName
          }
          name
          value
        }
        geneAliases {
          alias
        }
        geneClaims {
          source {
            citation
          }
        }
        geneCategories {
          name
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getGeneRecordQuery correctly' do
    result = execute_graphql(query, variables: { name: @gene.name })
    gene = result['data']['gene']
    expect(gene['conceptId']).to eq @gene.concept_id
    expect(gene['geneAttributes'].size).to eq 1
    expect(gene['geneAttributes'][0]['name']).to eq @gene_attr.name
    expect(gene['geneAttributes'][0]['value']).to eq @gene_attr.value

    expect(gene['geneAliases'].size).to eq 1
    expect(gene['geneAliases'][0]['alias']).to eq @gene_alias.alias

    expect(gene['geneClaims'].size).to eq 1
    expect(gene['geneClaims'][0]['source']['citation']).to eq @src.citation

    expect(gene['geneCategories'].size).to eq 1
    expect(gene['geneCategories'][0]['name']).to eq @gene_cat.name
  end
end
