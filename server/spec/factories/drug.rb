FactoryBot.define do
  factory :drug do
    sequence(:name) { |i| "Drug #{i}" }
    sequence(:concept_id) { |i| "rxnorm:#{i}" }
  end
end
