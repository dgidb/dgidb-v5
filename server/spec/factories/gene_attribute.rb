FactoryBot.define do
  factory :gene_attribute do
    gene
    name { 'InterPro Accession ID' }
    value { 'interpro:IPR006202' }
  end
end
