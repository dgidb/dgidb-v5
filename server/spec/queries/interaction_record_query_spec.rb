require 'rails_helper'

RSpec.describe 'Interaction Record Query', type: :graphql do
    before(:example) do
    #  Create data types needed here

        @gene = create(:gene)
        @drug = create(:drug)

        # @interaction_attributes = create(:interaction_attribute) TO DO: Interaction must exist

        # @drug = create(:drug, drug_aliases: [@drug_alias], drug_attributes: [@drug_attr], drug_applications: [@drug_app])
        # @interaction_type = create(:interactionTypes) TODO: Implement factory correctly
        @publications = create(:publication)

        @interaction = create(:interaction)
        # interaction_attributes: [@interaction_attributes])

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

        # expect(interaction['interactionAttributes'][0]['name']).to eq @interaction.interaction_attribute.name TO DO: add interaction attributes factory

        # expect(interaction['interactionTypes']['directionality']).to eq @interaction.interaction_types.directionality TO DO: add interaction types factory

        # expect(interaction['publications']['id']).to eq @interaction.publications.id TO DO: add publications


    end
end

