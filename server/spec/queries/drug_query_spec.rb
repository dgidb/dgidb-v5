require 'rails_helper'

RSpec.describe 'Drugs Query', type: :graphql do
  before(:example) do
    @drug_alias = create(:drug_alias)
    @drug_attr = create(:drug_attribute)
    @drug_app = create(:drug_application)
    @drug = create(:drug, drug_aliases: [@drug_alias], drug_attributes: [@drug_attr], drug_applications: [@drug_app])
  end

  let :query do
    <<-GRAPHQL
    query drug($conceptId: String!) {
      drug(conceptId: $conceptId) {
        conceptId
        name
        drugAliases {
          alias
        }
        drugAttributes {
          name
          value
        }
        drugApprovalRatings {
          rating
          source {
            sourceDbName
          }
        }
        drugApplications {
          appNo
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getDrugRecordQuery correctly' do
    result = execute_graphql(query, variables: { conceptId: @drug.concept_id })
    drug = result['data']['drug']

    expect(drug['conceptId']).to eq @drug.concept_id

    expect(drug['drugAliases'].size).to eq 1
    expect(drug['drugAliases'][0]['alias']).to eq @drug_alias.alias

    expect(drug['drugAttributes'].size).to eq 1
    expect(drug['drugAttributes'][0]['name']).to eq @drug_attr.name
    expect(drug['drugAttributes'][0]['value']).to eq @drug_attr.value

    expect(drug['drugApplications'].size).to eq 1
    expect(drug['drugApplications'][0]['appNo']).to eq @drug_app.app_no
  end
end
