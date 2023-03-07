FactoryBot.define do
  factory :drug_application do
    drug
    sequence(:app_no) { |i| "Drug application # #{i}" }
  end
end
