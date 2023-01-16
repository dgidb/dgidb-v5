FactoryBot.define do
  factory :drug_approval_rating do
    drug
    rating { 'Prescribable' }
  end
end
