FactoryBot.define do
  factory :gene_claim_category do
    sequence(:name) { |i| "Gene claim category name #{i}" }
  end
end
