require 'rails_helper'

RSpec.describe 'Interaction Record Query', type: :graphql do
    before(:example) do
    #  Create data types needed here

        @gene = create(:gene)
        @drug = create(:drug)

        # @drug = create(:drug, drug_aliases: [@drug_alias], drug_attributes: [@drug_attr], drug_applications: [@drug_app])
        # @interaction_type = create(:interactionTypes) TODO: Implement factory correctly
        @publications = create(:publication)

        @interaction = create(:interaction,
                            gene: [@gene],
                            drug: [@drug],
                            interaction_type: [@interaction_type],
                            publication: [@publications])
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
        interaction = result[data][interaction]

        expect(interaction['gene']['conceptId']).to eq @gene.concept_id

    end
end

