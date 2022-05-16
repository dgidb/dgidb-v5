FactoryBot.define do
  factory :gene do
    sequence(:name) { |i| "Gene #{i}" }
    sequence(:concept_id)
  end
end
