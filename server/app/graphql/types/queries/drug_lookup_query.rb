module Types::Queries
  module DrugLookupQuery
    def self.included(klass)
      klass.field :drug_matches, Types::DrugMatchType, null: false do
        description "Case-insensitively match Drug search terms to known drugs in the database."
        argument :search_terms, [GraphQL::Types::String], required: true
      end

      def drug_matches(search_terms: )
        remaining_terms = Set.new(search_terms.map(&:upcase))

        results = {
          direct_matches: [],
          ambiguous_matches: [],
          no_matches: []
        }

        #find exact matches on drug name
        direct_symbol_matches = Drug.where(name: remaining_terms)
        direct_symbol_matches.each do |d|
          results[:direct_matches] << {
            search_term: d.name,
            matches: [d],
            match_type: :direct
          }
        end
        remaining_terms -= direct_symbol_matches.map(&:name)

        #find exact matches on concept ID
        if remaining_terms.size.positive?
          direct_id_matches = Drug.where("concept_id IN (?)", remaining_terms)
          # TODO case insensitive index
          # direct_id_matches = Drug.where("upper(concept_id) IN (?)", remaining_terms)
          direct_id_matches.each do |d|
            results[:direct_matches] << {
              search_term: d.concept_id,
              matches: [d],
              match_type: :direct
            }
          end
          remaining_terms -= direct_id_matches.map(&:concept_id)
        end

        #find matches through aliases
        alias_matches = DrugAlias.eager_load(:drug)
          .where(alias: remaining_terms)
          .group_by(&:alias)

        alias_matches.each do |term, matches|

          key = if matches.size == 1
                  'direct'
                else
                  'ambiguous'
                end

          results["#{key}_matches".to_sym] << {
            search_term: term,
            matches: matches.map(&:drug),
            match_type: key.to_sym
          }
        end
        remaining_terms -= alias_matches.map { |term, _| term }

        #what still remains is unmatched
        remaining_terms.each do |term|
          results[:no_matches] << {
            search_term: term,
            matches: [],
            match_type: :no_matches
          }
        end

        results
      end
    end
  end
end
