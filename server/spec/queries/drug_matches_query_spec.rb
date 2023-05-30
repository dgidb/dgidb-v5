require 'rails_helper'

RSpec.describe 'Drug query matching', type: :graphql do
  before(:example) do
    @direct_name = create(:drug, name: 'DIRECT_NAME', concept_id: '123')
    @direct_concept_id = create(:drug, name: 'Drug 2', concept_id: 'DIRECT_CONCEPT_ID')

    @ambiguous_alias_1 = create(:drug_alias, alias: 'SHARED_ALIAS')
    @ambiguous_alias_2 = create(:drug_alias, alias: 'SHARED_ALIAS')

    @ambiguous_drug_1 = create(:drug, name: 'AMBIGUOUS_DRUG_1', drug_aliases: [@ambiguous_alias_1])
    @ambiguous_drug_2 = create(:drug, name: 'AMBIGUOUS_DRUG_2', drug_aliases: [@ambiguous_alias_2])

    @fake_drug = 'FAKE1'
  end

  let :query do
    <<-GRAPHQL
    query drugMatches($searchTerms: [String!]!) {
      drugMatches(searchTerms: $searchTerms) {
        directMatches {
          searchTerm
          matches {
            name
            conceptId
            approved
            drugAttributes {
              name
              value
            }
            interactions {
              id
              gene {
                name
                conceptId
                geneCategories {
                  name
                }
              }
              interactionScore
              interactionTypes {
                type
                directionality
              }
              publications {
                pmid
              }
              sources {
                fullName
              }
            }
          }
        }
        ambiguousMatches {
          searchTerm
          matches {
            id
            name
            conceptId
          }
        }
        noMatches {
          searchTerm
        }
      }
    }
    GRAPHQL
  end

  it 'should return the expected matches' do
    search_terms = [
      @direct_name.name, #direct match by drug name
      @direct_concept_id.concept_id,  # direct match by concept id
      @ambiguous_alias_1.alias, #ambiguous match by alias
      @fake_drug # no match
    ]
    result = execute_graphql(query, variables: { searchTerms: search_terms })

    direct_matches = result['data']['drugMatches']['directMatches']

    #we got 2 direct matches
    expect(direct_matches.size).to eq 2

    #each direct match only matches 1 term
    direct_matches.each do |match|
      expect(match['matches'].size).to eq 1
    end

    #we get direct match the two terms we expect to
    expect(direct_matches.map { |dm| dm['searchTerm'] }.sort).to eq([@direct_name.name, @direct_concept_id.concept_id].sort)

    #we get the expected Drug ID for our concept ID match and name match
    concept_res = direct_matches.select { |dm| dm['searchTerm'] == @direct_concept_id.concept_id }.first['matches'].first['conceptId']
    expect(concept_res).to eq(@direct_concept_id.concept_id)

    amb_matches = result['data']['drugMatches']['ambiguousMatches']

    #one search term should match ambiguously
    expect(amb_matches.size).to eq 1

    #it should be the term we expect
    expect(amb_matches.first['searchTerm']).to eq @ambiguous_alias_1.alias

    #that search term should match two drugs
    expect(amb_matches.first['matches'].size).to eq 2

    #the two drugs should be the ones we expect
    expect(amb_matches.first['matches'].map { |m| m['id'] }.sort).to eq [@ambiguous_drug_1.id, @ambiguous_drug_2.id].sort

    #our fake drug shouldn't match
    no_matches = result['data']['drugMatches']['noMatches']
    expect(no_matches.size).to eq 1
    expect(no_matches.map { |nm| nm['searchTerm'] }).to eq([@fake_drug])
  end

  it 'search should be case insensitive' do
    downcased_name = @direct_name.name.downcase
    downcased_id = @direct_concept_id.concept_id.downcase
    downcased_alias = @ambiguous_alias_1.alias.downcase
    search_terms = [downcased_name, downcased_id, downcased_alias]

    result = execute_graphql(query, variables: { searchTerms: search_terms })

    direct_matches = result['data']['drugMatches']['directMatches']
    expect(direct_matches.size).to eq 2

    ambig_matches = result['data']['drugMatches']['ambiguousMatches']
    expect(ambig_matches.size).to eq 1
  end
end
