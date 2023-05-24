module Types
  class DrugSuggestionType < Types::BaseObject
    field :suggestion, String, null: false
    field :drug_name, String, null: false
    field :concept_id, String, null: false
    field :suggestion_type, SuggestionTypeType, null: false
  end
end
