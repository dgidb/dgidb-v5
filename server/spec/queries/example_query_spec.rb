# Can probably be incorporated into the gene record lookup query once that's updated
RSpec.describe 'Sample GraphiQl query', type: :graphql do
  before(:example) do
    @drug = create(:drug, name: 'DOVITINIB')
    @gene = create(:gene)
    @int_type = create(:interaction_claim_type)
    @interaction = create(:interaction, gene: @gene, drug: @drug, interaction_types: [@int_type])

  end

  let :query do
    <<-GRAPHQL
    {
      drugs(names: ["DOVITINIB"]) {
        nodes {
          interactions {
            gene {
              name
            }
            drug {
              name
            }
            interactionScore
            interactionTypes {
              type
              directionality
            }
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute example query correctly' do
    result = execute_graphql(query)
    expect(result['data']['drugs']['nodes'].size).to eq 1
    expect(result['data']['drugs']['nodes'][0]['interactions'].size).to eq 1
    int = result['data']['drugs']['nodes'][0]['interactions'][0]
    expect(int['gene']['name']).to eq @gene.name
    expect(int['drug']['name']).to eq @drug.name
    expect(int['interactionScore']).to eq @interaction.interaction_score
    expect(int['interactionTypes'].size).to eq 1
    int_type = int['interactionTypes'][0]
    expect(int_type['type']).to eq @int_type.type
    expect(int_type['directionality']).to match(/#{@int_type.directionality}/i)
  end
end

