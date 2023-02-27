module Types::Queries
  module GeneLookupQuery
    def self.included(klass)
      klass.field :gene_matches, Types::GeneMatchType, null: false do
        description "Case-insensitively match Gene search terms to known genes in the database."
        argument :search_terms, [GraphQL::Types::String], required: true
      end

      def gene_matches(search_terms: )
        remaining_terms = Set.new(search_terms.map(&:upcase))

        results = {
          direct_matches: [],
          ambiguous_matches: [],
          no_matches: []
        }

        #find exact matches on gene symbol
        direct_symbol_matches = Gene.where('name in (?)', remaining_terms)
        direct_symbol_matches.each do |g|
          results[:direct_matches] << {
            search_term: g.name,
            matches: [g],
            match_type: :direct
          }
        end
        remaining_terms -= direct_symbol_matches.map(&:name)

        #find exact matches on concept ID
        if remaining_terms.size.positive?
          direct_id_matches = Gene.where("upper(concept_id) IN (?)", remaining_terms)
          direct_id_matches.each do |g|
            results[:direct_matches] << {
              search_term: g.concept_id,
              matches: [g],
              match_type: :direct
            }
          end
          remaining_terms -= direct_id_matches.map(&:concept_id)
        end

        #find matches through aliases
        alias_matches = GeneAlias.eager_load(:gene)
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
            matches: matches.map(&:gene),
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
