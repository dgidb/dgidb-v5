FactoryBot.define do
  factory :gene_attribute do
    gene
    sequence(:name) { |i| "Gene attribute name #{i}" }
    sequence(:value) { |i| "Gene attribute value #{i}" }
  end
end
