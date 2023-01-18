require 'rails_helper'

RSpec.describe 'Genes Query', type: :graphql do
  before(:example) do
    @drug_alias = create(:drug_alias)
    @drug_attr = create(:drug_attribute)
    @drug = create(:drug, drug_aliases: [@drug_alias], drug_attributes: [@drug_attr])
  end

  let :query do
    <<-GRAPHQL
    query drugs($names: [String!]!) {
      drugs(names: $names) {
        nodes {
          drugAliases {
            alias
          }
          drugAttributes {
            id
            name
            value
          }

        }
      }
    }
    GRAPHQL
  end

  it 'should execute getDrugRecordQuery correctly' do
    result = execute_graphql(query, variables: { names: [@drug.name] })
    expect(result['data']['drugs']['nodes'].size).to eq 1

    drug = result['data']['drugs']['nodes'][0]

    expect(drug['drugAliases'].size).to eq 1
    expect(drug['drugAliases'][0]['alias']).to eq @drug_alias.alias

    expect(drug['drugAttributes'].size).to eq 1
    expect(drug['drugAttributes'][0]['id']).to eq @drug_attr.id
    expect(drug['drugAttributes'][0]['name']).to eq @drug_attr.name
    expect(drug['drugAttributes'][0]['value']).to eq @drug_attr.value
  end
end

