require 'rails_helper'

RSpec.describe 'Drug Interaction Query', type: :graphql do
  before(:example) do
    @drug = build(:drug, approved: true)
    @cat = create(:gene_claim_category)
    @gene = create(:gene, gene_categories: [@cat])
    @pub = create(:publication)
    @int_type = create(:interaction_claim_type)
    @src = create(:source)
    @gene_claim = create(:gene_claim, source: @src)
    @drug_claim = create(:drug_claim, source: @src)
    @int = create(:interaction, drug: @drug, gene: @gene, interaction_types: [@int_type], publications: [@pub], sources: [@src])
    @int_claim = create(:interaction_claim, source: @src, gene_claim: @gene_claim, drug_claim: @drug_claim, interaction: @int)
  end

  let :query do
    <<-GRAPHQL
    query drugs($names: [String!]!) {
      drugs(names: $names) {
        nodes {
          interactions {
            gene {
              name
              geneCategories {
                name
              }
            }
            drug {
              name
              approved
            }
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
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getInteractionsByDrugsQuery correctly' do
    result = execute_graphql(query, variables: { names: [@drug.name] })
    drugs = result['data']['drugs']['nodes']
    expect(drugs.size).to eq 1

    interactions = drugs[0]['interactions']
    expect(interactions.size).to eq 1
    interaction = interactions[0]

    gene = interaction['gene']
    expect(gene['name']).to eq @gene.name
    expect(gene['geneCategories'].size).to eq 1
    expect(gene['geneCategories'][0]['name']).to eq @cat.name

    drug = interaction['drug']
    expect(drug['name']).to eq @drug.name
    # expect(drug['approved']).to be true

    expect(interaction['interactionScore']).to eq @int.score
    expect(interaction['interactionTypes'].size).to eq 1
    expect(interaction['interactionTypes'][0]['type']).to eq @int_type.type
    expect(interaction['interactionTypes'][0]['directionality']).to eq @int_type.directionality

    expect(interaction['publications'].size).to eq 1
    expect(interaction['publications'][0]['pmid']).to eq @pub.pmid

    expect(interaction['sources'].size).to eq 1
    expect(interaction['sources'][0]['fullName']).to eq @src.full_name
  end
end
