module Types::Queries
  module GeneLookupQuery
    def self.included(klass)
      klass.field :gene_matches, Types::GeneMatchType, null: false do
        description "Match Gene search terms to known Entrez Genes in the database."
        argument :search_terms, [GraphQL::Types::String], required: true
      end

      def gene_matches(search_terms: )
        remaining_terms = Set.new(search_terms)

        results = {
          direct_matches: [],
          ambiguous_matches: [],
          no_matches: []
        }

        #find exact matches on gene smybol
        direct_symbol_matches = Gene.where('name in (?)', remaining_terms)
        direct_symbol_matches.each do |g| 
          results[:direct_matches] << {
            search_term: g.name,
            matches: [g],
            match_type: :direct
          }
        end
        remaining_terms = remaining_terms - direct_symbol_matches.map(&:name)

        #find exact matches on entrez id
        terms_as_entrez_ids = remaining_terms.map { |term| Integer(term) rescue nil }.compact
        
        if terms_as_entrez_ids.size > 0
          direct_entrez_id_matches = Gene.where('concept_id in (?)', terms_as_entrez_ids)
          direct_entrez_id_matches.each do |g| 
            results[:direct_matches] << {
              search_term: g.entrez_id,
              matches: [g],
              match_type: :direct
            }
          end
          remaining_terms = remaining_terms - direct_matches.map(&:entrez_id)
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
        remaining_terms = remaining_terms - alias_matches.map { |term, _| term }

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
