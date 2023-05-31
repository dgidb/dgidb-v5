require 'rails_helper'

RSpec.describe 'Genes Query', type: :graphql do
  before(:example) do
    @gene = create(:gene)

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
        name
        interactions {
          id
          interactionScore
          interactionTypes {
            type
            directionality
          }
          publications {
            citation
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

