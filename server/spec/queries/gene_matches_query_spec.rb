require 'rails_helper'

RSpec.describe 'Ambiguous gene matches query', type: :graphql do
  before(:example) do
    @braf = create(:gene, name: 'BRAF')
    @alk1_alk = create(:gene_alias, alias: 'ALK1')
    @alk = create(:gene, name: 'ALK', gene_aliases: [@alk1_alk])
    @stk1_flt = create(:gene_alias, alias: 'STK1')
    @flt = create(:gene, name: 'FLT3', gene_aliases: [@stk1_flt])
    @stk1_cdk = create(:gene_alias, alias: 'STK1')
    @cdk = create(:gene, name: 'CDK7', gene_aliases: [@stk1_cdk])
  end

  let :query do
    <<-GRAPHQL
    query geneMatches($searchTerms: [String!]!) {
      geneMatches(searchTerms: $searchTerms) {
        directMatches {
          searchTerm
          matches {
            id
            name
          }
        }
        ambiguousMatches {
          searchTerm
          matches {
            id
            name
          }
        }
        noMatches {
          searchTerm
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getGeneMatchesQuery correctly' do
    search_terms = [
      @braf.name,
      @alk1_alk.alias,  # match by alias
      @stk1_flt.alias,  # ambiguous match
      'FAKE1'  # should go unmatched
    ]
    result = execute_graphql(query, variables: { searchTerms: search_terms })

    direct_matches = result['data']['geneMatches']['directMatches']
    expect(direct_matches.size).to eq 2
    braf_result = direct_matches.select { |dm| dm['searchTerm'] == @braf.name }[0]
    expect(braf_result['matches'].size).to eq 1
    expect(braf_result['matches'][0]['name']).to eq @braf.name
    expect(braf_result['matches'][0]['id']).to eq @braf.id
    alk_result = direct_matches.select { |dm| dm['searchTerm'] == @alk1_alk.alias }[0]
    expect(alk_result['matches'].size).to eq 1
    expect(alk_result['matches'][0]['name']).to eq @alk.name
    expect(alk_result['matches'][0]['id']).to eq @alk.id

    ambig_matches = result['data']['geneMatches']['ambiguousMatches']
    expect(ambig_matches.size).to eq 1
    expect(ambig_matches[0]['searchTerm']).to eq @stk1_flt.alias
    ambig_flt = ambig_matches[0]['matches'].select { |m| m['name'] == @flt.name }[0]
    expect(ambig_flt['id']).to eq @flt.id
    ambig_cdk = ambig_matches[0]['matches'].select { |m| m['name'] == @cdk.name }[0]
    expect(ambig_cdk['id']).to eq @cdk.id

    no_matches = result['data']['geneMatches']['noMatches']
    expect(no_matches.size).to eq 1
    expect(no_matches[0]['searchTerm']).to eq 'FAKE1'
  end
end