FactoryBot.define do
  factory :gene_alias do
    gene
    # alias { 'BRAF-1' }  # TODO hitting namespace issues, not sure how to resolve
  end
end
