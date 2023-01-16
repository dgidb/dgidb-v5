FactoryBot.define do
  factory :drug_alias do
    drug
    # alias { 'GLEEVEC' }  # TODO resolve collision
  end
end
