FactoryBot.define do
  factory :publication do
    sequence(:pmid, 1)
    sequence(:citation)
    sequence(:id)
  end
end
