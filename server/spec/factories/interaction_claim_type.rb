FactoryBot.define do
  factory :interaction_claim_type do
    sequence(:type) { |i| "Interaction claim type #{i}" }
    sequence(:definition) { |i| "definition of interaction claim type #{i}" }
  end
end

