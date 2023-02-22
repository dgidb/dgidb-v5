module Types
  class SearchMatchType < Types::BaseEnum
    value 'DIRECT', value: :direct
    value 'AMBIGUOUS', value: :ambiguous
    value 'NONE', value: :none
  end
end
