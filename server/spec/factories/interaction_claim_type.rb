FactoryBot.define do
  factory :interaction_claim_type do
    sequence(:type) { |i| "Interaction claim type #{i}" }
    definition { 'definition of interaction claim type' }
  end
end

