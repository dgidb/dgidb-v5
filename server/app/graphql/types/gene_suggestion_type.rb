module Types
  class GeneSuggestionType < Types::BaseObject
    field :suggestion, String, null: false
    field :gene_name, String, null: false
    field :concept_id, String, null: false
    field :suggestion_type, SuggestionTypeType, null: false
  end
end

