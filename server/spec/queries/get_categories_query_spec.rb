require 'rails_helper'

RSpec.describe 'Get Categories Queries', type: :graphql do
  before(:example) do
    @cat1 = create(:gene_claim_category)
    @cat2 = create(:gene_claim_category)

    @dm = create(:gene, gene_categories: [@cat1, @cat2])
    @src1 = create(:source)
    @gc1 = create(:gene_claim, gene_claim_categories: [@cat1], source: @src1, gene: @dm)
    @src2 = create(:source)
    @gc2 = create(:gene_claim, gene_claim_categories: [@cat2], source: @src2, gene: @dm)

    @ambig_alias1 = create(:gene_alias, alias: 'SHARED_ALIAS')
    @ambig_match1 = create(:gene, name: 'ambiguous_1', gene_aliases: [@ambig_alias1], gene_categories: [@cat1])
    @gc3 = create(:gene_claim, gene_claim_categories: [@cat1], source: @src1, gene: @ambig_match1)
    @gc4 = create(:gene_claim, gene_claim_categories: [@cat1], source: @src2, gene: @ambig_match1)
    @ambig_alias2 = create(:gene_alias, alias: 'SHARED_ALIAS')
    @ambig_match2 = create(:gene, name: 'ambiguous_2', gene_aliases: [@ambig_alias2], gene_categories: [@cat2])
    @gc5 = create(:gene_claim, gene_claim_categories: [@cat2], source: @src2, gene: @ambig_match2)

    @fake_gene = 'FAKE1'
  end

  let :get_categories_query do
    <<-GRAPHQL
    query geneCategoriesSearch($searchTerms: [String!]!) {
      geneMatches(searchTerms: $searchTerms) {
        directMatches {
          searchTerm
          matches {
            name
            conceptId
            geneCategoriesWithSources {
              name
              sourceNames
            }
          }
        }
        ambiguousMatches {
          searchTerm
          matches {
            name
            conceptId
            geneCategoriesWithSources {
              name
              sourceNames
            }
          }
        }
        noMatches {
          searchTerm
        }
      }
    }
  GRAPHQL
  end

  it 'should execute geneCategoriesSearch correctly' do
    search_terms = [@dm.name, @ambig_alias1.alias, @fake_gene]
    result = execute_graphql(get_categories_query, variables: { searchTerms: search_terms })

    direct_match_results = result['data']['geneMatches']['directMatches']
    expect(direct_match_results.size).to eq 1
    expect(direct_match_results[0]['searchTerm']).to eq @dm.name
    expect(direct_match_results[0]['matches'].size).to eq 1
    expect(direct_match_results[0]['matches'][0]['name']).to eq @dm.name
    expect(direct_match_results[0]['matches'][0]['conceptId']).to eq @dm.concept_id

    result_cats = direct_match_results[0]['matches'][0]['geneCategoriesWithSources']
    result_cat1 = result_cats.select{ |c| c['name'] == @cat1.name }[0]
    expect(result_cat1['sourceNames']).to eq [@src1.source_db_name]
    result_cat2 = result_cats.select{ |c| c['name'] == @cat2.name }[0]
    expect(result_cat2['sourceNames']).to eq [@src2.source_db_name]

    ambig_match_results = result['data']['geneMatches']['ambiguousMatches']
    expect(ambig_match_results.size).to eq 1
    expect(ambig_match_results[0]['searchTerm']).to eq @ambig_alias1.alias

    ambig_match_result1 = ambig_match_results[0]['matches'].select{ |a| a['name'] == @ambig_match1.name }[0]
    expect(ambig_match_result1['geneCategoriesWithSources'][0]['name']).to eq @cat1.name
    expect(ambig_match_result1['geneCategoriesWithSources'][0]['sourceNames']).to contain_exactly @src1.source_db_name, @src2.source_db_name

    ambig_match_result2 = ambig_match_results[0]['matches'].select{ |a| a['name'] == @ambig_match2.name }[0]
    expect(ambig_match_result2['geneCategoriesWithSources'][0]['name']).to eq @cat2.name
    expect(ambig_match_result2['geneCategoriesWithSources'][0]['sourceNames']).to contain_exactly @src2.source_db_name


    no_match_results = result['data']['geneMatches']['noMatches']
    expect(no_match_results[0]['searchTerm']).to eq @fake_gene
  end
end
