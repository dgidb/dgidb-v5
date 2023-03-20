FactoryBot.define do
    factory :interaction_claim_type do
        interaction
        sequence(:directionality) { |i| "Interaction directionality #{i}" }
        sequence(:type) { |i| "Interaction type #{i}" }
    end
  end
