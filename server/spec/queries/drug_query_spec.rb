require 'rails_helper'

RSpec.describe 'Genes Query', type: :graphql do
  before(:example) do
    @drug_alias = create(:drug_alias, alias: 'GLEEVEC')
    @drug_attr = create(:drug_attribute)
    @drug = create(:drug, drug_aliases: [@drug_alias], drug_attributes: [@drug_attr])
  end

  let :query do
    <<-GRAPHQL
    query drugs($name: [String!]!) {
      drugs(name: $name) {
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
    GRAPHQL
  end

  it 'should execute getGeneRecordQuery correctly' do
    result = execute_graphql(query, variables: { name: [@drug.name] })
    expect(result['data']['drugs'].size).to eq 1

    drug = result['data']['drugs'][0]

    expect(drug['drugAliases'].size).to eq 1
    expect(drug['drugAliases'][0]['alias']).to eq @drug_alias.alias

    expect(drug['drugAttributes'].size).to eq 1
    expect(drug['drugAttributes'][0]['id']).to eq @drug_attr.id
    expect(drug['drugAttributes'][0]['name']).to eq @drug_attr.name
    expect(drug['drugAttributes'][0]['value']).to eq @drug_attr.value
  end
end

