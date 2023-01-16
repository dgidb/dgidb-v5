require 'rails_helper'

RSpec.describe 'Gene Sources Query', type: :graphql do
  before(:example) do
    @src_type = create(:source_type)
    @src = create(:source, source_types: [@src_type])
    @gene = create(:gene)
    @gene_claim = create(:gene_claim, source: @src, gene: @gene)
  end

  let :query do
    <<-GRAPHQL
    query sources($sourceType: SourceTypeFilter) {
      sources(sourceType: $sourceType) {
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
        nodes {
          sourceDbName
          geneClaimsCount
          geneClaimsInGroupsCount
          citation
          license
          licenseLink
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getGeneSourcesQuery correctly' do
    result = execute_graphql(query, variables: { sourceType: @src_type.type.upcase })
    # TODO what to test for cursor stuff?

    expect(result['data']['sources']['nodes'].size).to eq 1
    source = result['data']['sources']['nodes'][0]
    expect(source['sourceDbName']).to eq @src.source_db_name

    # TODO why do the claim counts work, but the claim-in-group counts don't?
    expect(source['geneClaimsCount']).to eq 1
    # expect(source['geneClaimsInGroupsCount']).to eq 1

    expect(source['citation']).to eq @src.citation
    expect(source['license']).to eq @src.license
    expect(source['licenseLink']).to eq @src.license_link
  end
end

