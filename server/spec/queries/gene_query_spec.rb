require 'rails_helper'

RSpec.describe 'Genes Query', type: :graphql do
  before(:example) do
    @src = create(:source)
    @gene_claim = create(:gene_claim, source: @src)
    @gene_attr = create(:gene_attribute)
    @gene_alias = create(:gene_alias)
    @gene_cat = create(:gene_claim_category)
    @gene = create(:gene, gene_attributes: [@gene_attr], gene_aliases: [@gene_alias], gene_claims: [@gene_claim], gene_categories: [@gene_cat])

    @drug = create(:drug)
    @src = create(:source)
    @pub = create(:publication)
    @int_type = create(:interaction_claim_type)
    @interaction = create(:interaction, drug: @drug, gene: @gene, interaction_types: [@int_type], publications: [@pub], sources: [@src])
  end

  let :query do
    <<-GRAPHQL
    query gene($conceptId: String!) {
      gene(conceptId: $conceptId) {
        conceptId
        name
        geneAttributes {
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
        interactions {
          id
          interactionScore
          interactionTypes {
            type
            directionality
          }
          publications {
            pmid
          }
          sources {
            fullName
          }
          drug {
            name
            conceptId
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getGeneRecordQuery correctly' do
    result = execute_graphql(query, variables: { conceptId: @gene.concept_id })
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

    expect(gene['interactions'].length).to eq 1
    interaction = gene['interactions'][0]
    expect(interaction['id']).to eq @interaction.id
    expect(interaction['interactionTypes'].length).to eq 1
    expect(interaction['interactionTypes'][0]['type']).to eq @int_type.type
    expect(interaction['interactionScore']).to eq @interaction.score
    expect(interaction['publications'].length).to eq 1
    expect(interaction['publications'][0]['pmid']).to eq @pub.pmid
    expect(interaction['sources'].size).to eq 1
    expect(interaction['sources'][0]['fullName']).to eq @src.full_name
    expect(interaction['drug']['name']).to eq @drug.name
    expect(interaction['drug']['conceptId']).to eq @drug.concept_id
  end
end
