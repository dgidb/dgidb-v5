FactoryBot.define do
  factory :interaction do
    sequence(:id) { |i| "DRUG #{i}" }  # should always be uppercase
    gene
    drug
    score { rand }
  end
end
