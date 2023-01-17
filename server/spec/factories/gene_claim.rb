FactoryBot.define do
  factory :gene_claim do
    source
    sequence(:name) { |i| "Gene claim #{i}" }
    sequence(:nomenclature) { |i| "Gene claim nomenclature #{i}" }
  end
end

