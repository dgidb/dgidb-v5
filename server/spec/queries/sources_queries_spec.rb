require 'rails_helper'

RSpec.describe 'Sources queries', type: :graphql do
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
    Genome::Normalizers::PopulateCounters.populate_source_counters
  end

  let :drug_sources_query do
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
          citation
          citationShort
          pmid
          pmcid
          doi
          license
          licenseLink
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getDrugSourcesQuery correctly' do
    result = execute_graphql(drug_sources_query, variables: { sourceType: @src_type.type.upcase })
    expect(result['data']['sources']['nodes'].size).to eq 1
    source = result['data']['sources']['nodes'][0]
    expect(source['sourceDbName']).to eq @src.source_db_name

    expect(source['drugClaimsCount']).to eq 1
    expect(source['drugClaimsInGroupsCount']).to eq 1

    expect(source['citation']).to eq @src.citation
    expect(source['license']).to eq @src.license
    expect(source['licenseLink']).to eq @src.license_link
  end

  let :gene_sources_query do
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
          citationShort
          pmid
          pmcid
          doi
          license
          licenseLink
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getGeneSourcesQuery correctly' do
    result = execute_graphql(gene_sources_query, variables: { sourceType: @src_type.type.upcase })
    expect(result['data']['sources']['nodes'].size).to eq 1
    source = result['data']['sources']['nodes'][0]
    expect(source['sourceDbName']).to eq @src.source_db_name

    expect(source['geneClaimsCount']).to eq 1
    expect(source['geneClaimsInGroupsCount']).to eq 1

    expect(source['citation']).to eq @src.citation
    expect(source['license']).to eq @src.license
    expect(source['licenseLink']).to eq @src.license_link
  end

  let :druggable_sources_query do
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
          citationShort
          pmid
          pmcid
          doi
          license
          licenseLink
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getDruggableSourcesQuery correctly' do
    result = execute_graphql(druggable_sources_query, variables: { sourceType: @src_type.type.upcase })
    expect(result['data']['sources']['nodes'].size).to eq 1
    source = result['data']['sources']['nodes'][0]
    expect(source['sourceDbName']).to eq @src.source_db_name

    expect(source['drugClaimsCount']).to eq 1
    expect(source['drugClaimsInGroupsCount']).to eq 1
    expect(source['geneClaimsCount']).to eq 1
    expect(source['geneClaimsInGroupsCount']).to eq 1
    expect(source['interactionClaimsCount']).to eq 1
    expect(source['interactionClaimsInGroupsCount']).to eq 1

    expect(source['citation']).to eq @src.citation
    expect(source['license']).to eq @src.license
    expect(source['licenseLink']).to eq @src.license_link
  end

  let :interaction_sources_query do
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
          citationShort
          pmid
          pmcid
          doi
          license
          licenseLink
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getInteractionSourcesQuery correctly' do
    result = execute_graphql(interaction_sources_query, variables: { sourceType: @src_type.type.upcase })
    expect(result['data']['sources']['nodes'].size).to eq 1
    source = result['data']['sources']['nodes'][0]
    expect(source['sourceDbName']).to eq @src.source_db_name

    expect(source['drugClaimsCount']).to eq 1
    expect(source['drugClaimsInGroupsCount']).to eq 1
    expect(source['geneClaimsCount']).to eq 1
    expect(source['geneClaimsInGroupsCount']).to eq 1
    expect(source['interactionClaimsCount']).to eq 1
    expect(source['interactionClaimsInGroupsCount']).to eq 1

    expect(source['citation']).to eq @src.citation
    expect(source['license']).to eq @src.license
    expect(source['licenseLink']).to eq @src.license_link
  end
end
