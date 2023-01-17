FactoryBot.define do
  factory :drug_alias do
    drug
    sequence(:alias) { |i| "Drug alias #{i}" }
  end
end
