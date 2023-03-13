FactoryBot.define do
  factory :gene_alias do
    gene
    sequence(:alias) { |i| "Gene alias #{i}" }
  end
end
