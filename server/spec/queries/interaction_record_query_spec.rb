require 'rails_helper'

RSpec.describe 'Interaction Record Query', type: :graphql do
    before(:example) do

        @gene = create(:gene)
        @drug = create(:drug)
        @publication = create(:publication)
        @int_attr = create(:interaction_attribute)
        @int_type = create(:interaction_claim_type,
                            directionality: 'inhibitory')
        @interaction = create(:interaction,
                            interaction_attributes: [@int_attr],
                            publications: [@publication],
                            drug: @drug,
                            gene: @gene,
                            interaction_types: [@int_type] )

    end

    let :query do
        <<-GRAPHQL
        query interaction($id: ID!) {
            interaction(id: $id) {
                gene {
                    name
                    conceptId
                }
                drug {
                    name
                    conceptId
                }
                interactionTypes{
                    directionality
                    type
                }
                interactionScore
                publications{
                    id
                    pmid
                    citation
                }
                interactionAttributes {
                    name
                    value
                }
           }
        }
        GRAPHQL
    end

    it 'should execute getInteractionRecordQuery correctly' do
        result = execute_graphql(query, variables: { id: @interaction.id })
        interaction = result['data']['interaction']

        expect(interaction['gene']['conceptId']).to eq @interaction.gene.concept_id
        expect(interaction['gene']['name']).to eq @interaction.gene.name

        expect(interaction['drug']['conceptId']).to eq @interaction.drug.concept_id
        expect(interaction['drug']['name']).to eq @interaction.drug.name

        expect(interaction['publications'][0]['pmid']).to eq @interaction.publications[0].pmid
        expect(interaction['publications'][0]['id']).to eq @interaction.publications[0].id
        expect(interaction['publications'][0]['citation']).to eq @interaction.publications[0].citation

        expect(interaction['interactionAttributes'][0]['name']).to eq @interaction.interaction_attributes[0].name
        expect(interaction['interactionAttributes'][0]['value']).to eq @interaction.interaction_attributes[0].value

        expect(interaction['interactionTypes'][0]['directionality']).to match(/#{@interaction.interaction_types[0].directionality}/i)
        expect(interaction['interactionTypes'][0]['type']).to eq @interaction.interaction_types[0].type
    end
end

