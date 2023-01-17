FactoryBot.define do
  factory :source_type do
    sequence(:type, %w[potentially_druggable gene drug interaction].cycle)
    sequence(:display_name) { |i| "Source type display name #{i}" }
  end
end
