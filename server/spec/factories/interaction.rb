FactoryBot.define do
  factory :interaction do
    gene
    drug
    # interaction_attributes
    # publications this needs to be here (I think) but causes a lot to freak out
    score { rand }
  end
end
