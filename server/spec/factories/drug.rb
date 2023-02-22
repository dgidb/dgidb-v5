FactoryBot.define do
  factory :drug do
    sequence(:name) { |i| "DRUG #{i}" }  # should always be uppercase
    sequence(:concept_id) { |i| "rxnorm:#{i}" }
  end
end
