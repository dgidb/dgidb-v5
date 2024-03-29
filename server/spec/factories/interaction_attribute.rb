FactoryBot.define do
    factory :interaction_attribute do
        interaction
        sequence(:name) { |i| "Interaction attribute name #{i}" }
        sequence(:value) { |i| "Interaction attribute value #{i}" }
    end
  end
