require 'rails_helper'

RSpec.describe 'Gene Interaction Query', type: :graphql do
  before(:example) do
    @drug_attr = build(:drug_attribute)
    @drug_appr_rating = build(:drug_approval_rating)
    @drug = build(:drug, approved: true, drug_approval_ratings: [@drug_appr_rating], drug_attributes: [@drug_attr])
    @cat = create(:gene_claim_category)
    @gene = create(:gene, gene_categories: [@cat])
    @int_type = create(:interaction_claim_type)
    @pub = create(:publication)
    @src = create(:source)
    @int = create(
      :interaction, drug: @drug, gene: @gene, interaction_types: [@int_type], publications: [@pub], sources: [@src]
    )
  end

  let :query do
    <<-GRAPHQL
    query genes($names: [String!]!) {
      genes(name: $names) {
        name
        interactions {
          drug {
            name
            approved
            drugApprovalRatings {
              rating
            }
            drugAttributes {
              name
              value
            }
          }
          gene {
            name
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
            id
            fullName
          }
        }
      }
    }
    GRAPHQL
  end

  it 'should execute getInteractionsByGenesQuery correctly' do
    result = execute_graphql(query, variables: { names: [@gene.name] })

    genes = result['data']['genes']
    expect(genes.size).to eq 1

    interactions = genes[0]['interactions']
    expect(interactions.size).to eq 1
    interaction = interactions[0]

    drug = interaction['drug']
    expect(drug['name']).to eq @drug.name
    # expect(drug['approved']).to be_true  # TODO fails?
    expect(drug['drugApprovalRatings'].size).to eq 1
    expect(drug['drugApprovalRatings'][0]['rating']).to eq @drug_appr_rating.rating
    expect(drug['drugAttributes'].size).to eq 1
    expect(drug['drugAttributes'][0]['name']).to eq @drug_attr.name
    expect(drug['drugAttributes'][0]['value']).to eq @drug_attr.value

    expect(interaction['gene']['name']).to eq @gene.name

    expect(interaction['interactionScore']).to eq @int.score
    expect(interaction['interactionTypes'].size).to eq 1
    expect(interaction['interactionTypes'][0]['type']).to eq @int_type.type
    expect(interaction['interactionTypes'][0]['directionality']).to eq @int_type.directionality
    expect(interaction['publications'].size).to eq 1
    expect(interaction['publications'][0]['pmid']).to eq @pub.pmid

    expect(interaction['sources'].size).to eq 1
    expect(interaction['sources'][0]['id']).to eq @src.id
    expect(interaction['sources'][0]['fullName']).to eq @src.full_name
  end
end

