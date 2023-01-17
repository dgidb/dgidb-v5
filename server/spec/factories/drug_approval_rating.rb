FactoryBot.define do
  factory :drug_approval_rating do
    drug
    sequence(:rating) { |i| "Drug approval rating #{i}" }
  end
end
