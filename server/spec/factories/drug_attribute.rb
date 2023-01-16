FactoryBot.define do
  factory :drug_attribute do
    drug
    name { 'Drug Class' }
    value { 'ALK Inhibitor' }
  end
end
