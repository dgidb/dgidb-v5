require 'rails_helper'

RSpec.describe 'Interactions queries', type: :graphql do
  before(:example) do
    @drug1 = create(:drug)
    @drug2 = create(:drug)
    @drug3 = create(:drug)

    @gene1 = create(:gene)
    @gene2 = create(:gene)

    @int1 = create(:interaction, drug: @drug1, gene: @gene1)
    @int2 = create(:interaction, drug: @drug1, gene: @gene2)
    @int3 = create(:interaction, drug: @drug2, gene: @gene1)
    @int4 = create(:interaction, drug: @drug3, gene: @gene1)
  end

  let :interactions_name_query do
    <<-GRAPHQL
    query interactions($drugNames: [String!], $geneNames: [String!]) {
      interactions(drugNames: $drugNames, geneNames: $geneNames) {
        edges {
          node {
            id
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute basic interactions searches by name correctly' do
    result = execute_graphql(interactions_name_query, variables: { drugNames: [@drug1.name] })
    expect(result["data"]["interactions"]["edges"].length).to eq 2

    result = execute_graphql(interactions_name_query, variables: { drugNames: [@drug1.name], geneNames: [@gene1.name]})
    expect(result["data"]["interactions"]["edges"].length).to eq 1

    result = execute_graphql(interactions_name_query, variables: { drugNames: [@drug1.name] , geneNames: []})
    expect(result["data"]["interactions"]["edges"].length).to eq 2

    result = execute_graphql(interactions_name_query, variables: { drugNames: [], geneNames: [@gene1.name] })
    expect(result["data"]["interactions"]["edges"].length).to eq 3

    result = execute_graphql(interactions_name_query, variables: { drugNames: [], geneNames: [@gene2.name] })
    expect(result["data"]["interactions"]["edges"].length).to eq 1

    result = execute_graphql(interactions_name_query, variables: { drugNames: [@drug1.name, @drug2.name, @drug3.name], geneNames: [@gene1.name, @gene2.name] })
    expect(result["data"]["interactions"]["edges"].length).to eq 4
  end
end
