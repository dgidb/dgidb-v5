require 'rails_helper'

RSpec.describe 'Typeahead Queries', type: :graphql do
  before(:example) do
    create(:gene, name: "EGFR")
    create(:gene, name: "EGFR3")
    create(:gene, name: "FOO")

    create(:drug, name: 'SUNITINIB')
    create(:drug, name: 'SUNIT')
    create(:drug, name: 'FOO')
  end

  let :gene_typeahead_query do
    <<-GRAPHQL
    query geneNameSuggestions($name: String!) {
      genes(name: $name, first: 10) {
        nodes {
          name
        }
      }
    }
    GRAPHQL
  end

  it 'should provide gene name suggestions via left anchored string matching' do
    result = execute_graphql(gene_typeahead_query, variables: { name: "EGFR"})

    expect(result['data']['genes']['nodes'].size).to eq 2
    name_suggestions = result['data']['genes']['nodes'].map { |n| n['name'] }.sort
    expect(name_suggestions).to eq ['EGFR', 'EGFR3'].sort
  end

  let :drug_typeahead_query do
    <<-GRAPHQL
    query drugNameSuggestions($name: String!) {
      drugs(name: $name, first: 10) {
        nodes {
          name
        }
      }
    }
    GRAPHQL
  end

  it 'should provide drug name suggestions via left anchored string matching' do
    result = execute_graphql(drug_typeahead_query, variables: { name: "SUNIT"})

    expect(result['data']['drugs']['nodes'].size).to eq 2
    name_suggestions = result['data']['drugs']['nodes'].map { |n| n['name'] }.sort
    expect(name_suggestions).to eq ['SUNIT', 'SUNITINIB'].sort
  end
end
