FactoryBot.define do
  factory :interaction do
    gene
    drug
    score { rand }
  end
end
