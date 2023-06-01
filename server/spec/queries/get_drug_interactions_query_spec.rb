require 'rails_helper'

RSpec.describe 'Drugs Query', type: :graphql do
  before(:example) do
    @drug = create(:drug)
    @gene = create(:gene)
    @src = create(:source)
    @pub = create(:publication)
    @int_type = create(:interaction_claim_type)
    @interaction = create(:interaction, drug: @drug, gene: @gene, interaction_types: [@int_type], publications: [@pub], sources: [@src])
  end

  let :query do
    <<-GRAPHQL
    query drug($conceptId: String!) {
      drug(conceptId: $conceptId) {
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
          gene {
            name
            conceptId
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getDrugRecordQuery correctly' do
    result = execute_graphql(query, variables: { conceptId: @drug.concept_id })
    drug = result['data']['drug']
    expect(drug['interactions'].length).to eq 1
    interaction = drug['interactions'][0]
    expect(interaction['id']).to eq @interaction.id
    expect(interaction['interactionTypes'].length).to eq 1
    expect(interaction['interactionTypes'][0]['type']).to eq @int_type.type
    expect(interaction['gene']['name']).to eq @gene.name
    expect(interaction['gene']['conceptId']).to eq @gene.concept_id
    expect(interaction['interactionScore']).to eq @interaction.score
    expect(interaction['publications'].length).to eq 1
    expect(interaction['publications'][0]['pmid']).to eq @pub.pmid
    expect(interaction['sources'].size).to eq 1
    expect(interaction['sources'][0]['fullName']).to eq @src.full_name
  end
end

