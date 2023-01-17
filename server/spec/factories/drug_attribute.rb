FactoryBot.define do
  factory :drug_attribute do
    drug
    sequence(:name) { |i| "Drug attribute name #{i}" }
    sequence(:value) { |i| "Drug attribute value #{i}" }
  end
end
