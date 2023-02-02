require 'rails_helper'

RSpec.describe 'Interaction claim types query', type: :graphql do
  before(:example) do
    @source1 = create(:source)
    @source2 = create(:source)
    @gc1 = create(:gene_claim, source: @source1)
    @gc2 = create(:gene_claim, source: @source2)
    @dc1 = create(:drug_claim, source: @source1)
    @dc2 = create(:drug_claim, source: @source2)
    @ict1 = create(:interaction_claim_type)
    @ict2 = create(:interaction_claim_type)
    @ict3 = create(:interaction_claim_type)
    @ic1 = create(:interaction_claim, drug_claim: @dc1, gene_claim: @gc1, interaction_claim_types: [@ict1, @ict2], source: @source1)
    @ic2 = create(:interaction_claim, drug_claim: @dc2, gene_claim: @gc2, interaction_claim_types: [@ict3], source: @source2)
  end

  let :query do
    <<-GRAPHQL
    {
      interactionClaimTypes {
        nodes {
          definition
          directionality
          reference
          type
        }
      }
    }
    GRAPHQL
  end

  it 'should fetch all interaction claim types' do
    result = execute_graphql(query)
    nodes = result['data']['interactionClaimTypes']['nodes']
    expect(nodes.size).to eq 3

    ict1 = nodes.select { |n| n['type'] == @ict1 }[0]
    expect(@ict1['definition']).to eq @ict1.definition
    expect(@ict1['directionality']).to eq @ict1.directionality
    expect(@ict1['reference']).to eq @ict1.reference

    ict2 = nodes.select { |n| n['type'] == @ict2 }[0]
    expect(@ict2['definition']).to eq @ict2.definition
    expect(@ict2['directionality']).to eq @ict2.directionality
    expect(@ict2['reference']).to eq @ict2.reference

    ict3 = nodes.select { |n| n['type'] == @ict3 }[0]
    expect(@ict3['definition']).to eq @ict3.definition
    expect(@ict3['directionality']).to eq @ict3.directionality
    expect(@ict3['reference']).to eq @ict3.reference
  end
end
