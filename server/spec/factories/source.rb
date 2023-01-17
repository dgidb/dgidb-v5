FactoryBot.define do
  factory :source do
    sequence(:source_db_name) { |i| "Source DB Name #{i}" }
    sequence(:full_name) { |i| "Full Name #{i}" }
    source_db_version { 'version' }
    citation { 'citation' }
    sequence(:id)
    license { 'license' }
    license_link { 'license URL' }
  end
end
