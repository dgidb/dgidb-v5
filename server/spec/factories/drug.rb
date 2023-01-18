FactoryBot.define do
  factory :drug do
    sequence(:name) { |i| "Drug #{i}" }
    sequence(:concept_id)
  end
end
