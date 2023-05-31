require 'rails_helper'

RSpec.describe 'Typeahead Queries', type: :graphql do
  before(:example) do
    create(:gene, name: 'EGFR')
    ga = create(:gene_alias, alias: 'EGFR4')
    create(:gene, name: 'EGFR3', gene_aliases: [ga])
    create(:gene, name: 'FOO')

    da = create(:drug_alias, alias: 'SUNITINIB MALATE')
    create(:drug, name: 'SUNITINIB', drug_aliases: [da])
    create(:drug, name: 'SUNIT')
    create(:drug, name: 'FOO')
  end

  let :gene_typeahead_query do
    <<-GRAPHQL
    query geneNameSuggestions($term: String!) {
      geneSuggestions(term: $term, n: 10) {
        suggestion
      }
    }
    GRAPHQL
  end

  it 'should provide gene name suggestions via left anchored string matching' do
    result = execute_graphql(gene_typeahead_query, variables: { term: "EGFR"})

    expect(result['data']['geneSuggestions'].size).to eq 3
    name_suggestions = result['data']['geneSuggestions'].map { |n| n['suggestion'] }.sort
    expect(name_suggestions).to eq ['EGFR', 'EGFR3', 'EGFR4'].sort
  end

  let :drug_typeahead_query do
    <<-GRAPHQL
    query drugNameSuggestions($term: String!) {
      drugSuggestions(term: $term, n: 10) {
        suggestion
      }
    }
    GRAPHQL
  end

  it 'should provide drug name suggestions via left anchored string matching' do
    result = execute_graphql(drug_typeahead_query, variables: { term: "SUNIT"})

    expect(result['data']['drugSuggestions'].size).to eq 3
    name_suggestions = result['data']['drugSuggestions'].map { |n| n['suggestion'] }.sort
    expect(name_suggestions).to eq ['SUNIT', 'SUNITINIB', 'SUNITINIB MALATE'].sort
  end
end
