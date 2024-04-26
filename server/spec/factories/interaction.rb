FactoryBot.define do
  factory :interaction do
    sequence(:id) { |i| "INTERACTION #{i}" }  # should always be uppercase
    gene
    drug
    score { rand }
  end
end
