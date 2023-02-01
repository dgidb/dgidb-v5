module Types
  class DrugSearchResult < Types::BaseObject
    field :search_term, String, null: false
    field :matches, [Types::DrugType], null: false
    field :match_type, Types::SearchMatchType, null: false
  end

  class DrugMatchType < Types::BaseObject
    field :direct_matches, [Types::DrugSearchResult], null: false
    field :ambiguous_matches, [Types::DrugSearchResult], null: false
    field :no_matches, [Types::DrugSearchResult], null: false
  end
end
