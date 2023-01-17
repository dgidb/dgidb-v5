module Types
  class SearchMatchType < Types::BaseEnum
    value 'DIRECT', value: :direct
    value 'AMBIGUOUS', value: :ambiguous
    value 'NONE', value: :none
  end

  class GeneSearchResult < Types::BaseObject
    field :search_term, String, null: false
    field :matches, [Types::GeneType], null: false
    field :match_type, Types::SearchMatchType, null: false
  end

  class GeneMatchType < Types::BaseObject
    field :direct_matches, [Types::GeneSearchResult], null: false
    field :ambiguous_matches, [Types::GeneSearchResult], null: false
    field :no_matches, [Types::GeneSearchResult], null: false
  end
end
