FactoryBot.define do
  factory :drug_claim do
    sequence(:name) { |i| "Drug #{i}" }
    nomenclature { 'Primary Name' }
  end
end
