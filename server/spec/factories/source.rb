FactoryBot.define do
  factory :source do
    source_db_name { 'Pharos' }
    full_name { 'Pharos' }
    source_db_version { '28-November-2022' }
    sequence(:id)
  end
end
