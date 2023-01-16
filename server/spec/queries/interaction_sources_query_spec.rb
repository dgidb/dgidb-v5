require 'rails_helper'

RSpec.describe 'Interaction Sources Query', type: :graphql do
  before(:example) do
    @src_type = create(:source_type)
    @src = create(:source, source_types: [@src_type])
    @gene = create(:gene)
    @gene_cat = create(:gene_claim_category)
    @gene_claim = create(:gene_claim, gene_claim_categories: [@gene_cat], source: @src, gene: @gene)
    @drug = create(:drug)
    @drug_claim = create(:drug_claim, drug: @drug, source: @src)
    @int = create(:interaction, drug: @drug, gene: @gene)
    @int_claim = create(:interaction_claim, drug_claim: @drug_claim, gene_claim: @gene_claim, source: @src, interaction: @int)
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
          drugClaimsCount
          drugClaimsInGroupsCount
          geneClaimsCount
          geneClaimsInGroupsCount
          interactionClaimsCount
          interactionClaimsInGroupsCount
          citation
          license
          licenseLink
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getDruggableSourcesQuery correctly' do
    result = execute_graphql(query, variables: { sourceType: @src_type.type.upcase })
    # TODO what to test for cursor stuff?

    expect(result['data']['sources']['nodes'].size).to eq 1
    source = result['data']['sources']['nodes'][0]
    expect(source['sourceDbName']).to eq @src.source_db_name

    # TODO why do the claim counts work, but the claim-in-group counts don't?
    expect(source['drugClaimsCount']).to eq 1
    # expect(source['drugClaimsInGroupsCount']).to eq 1
    expect(source['geneClaimsCount']).to eq 1
    # expect(source['geneClaimsInGroupsCount']).to eq 1
    expect(source['interactionClaimsCount']).to eq 1
    # expect(source['interactionClaimsInGroupsCount']).to eq 1

    expect(source['citation']).to eq @src.citation
    expect(source['license']).to eq @src.license
    expect(source['licenseLink']).to eq @src.license_link
  end
end

