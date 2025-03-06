module Genome
  module Groupers
    # Provides some shared methods for groupers, shouldn't be directly instantiated.
    class Base < Genome::DataImporter

      def initialize
        @term_to_normalized_id = {}
        @sources = {}
      end

      private

      def print_grouping_message(claims, source_id)
        if source_id.nil?
          puts "Grouping #{claims.length} ungrouped #{@entity_type} claims"
        else
          begin
            source = Source.find(source_id)
          rescue ActiveRecord::RecordNotFound
            puts 'Unrecognized source ID provided'
            return
          end
          source_name = source.source_db_name
          puts "Grouping #{claims.length} ungrouped #{@entity_type} claims from #{source_name}"
        end
      end

      # Sends an empty query to concept normalizer to retrieve the service's version
      def retrieve_normalizer_version
        response = retrieve_normalized_concept_id('')
        response['service_meta_']['version']
      end

      def fetch_json_response(url)
        begin
          uri = URI(url)
        rescue URI::InvalidURIError
          Rails.logger.debug "Invalid URL: #{url}"
          return
        end

        response = Net::HTTP.get_response(uri)
        unless response.is_a?(Net::HTTPSuccess)
          raise StandardError, "Received failing HTTP response: #{response} for request #{url}"
        end

        JSON.parse(response.body)
      end

      def fetch_source_meta
        url = URI("#{@normalizer_host}search?q=")
        body = fetch_json_response(url)
        body['source_matches'].transform_values { |value| value['source_meta_'] }
      end

      # Construct individual groups for normalizing terms
      # Returns a sorted array of normalizable concept IDs, a primary name if given,
      # and aliases that aren't otherwise known to normalize (e.g. other names, trade names,
      # concept IDs from niche namespaces)
      def get_claim_search_groups(claim, claim_aliases)
        groups = { 'concept_ids' => [], 'name' => nil, 'aliases' => [] }

        concept_ids = []
        if normalizable_ids.include? claim.nomenclature
          concept_ids << [claim.name, claim.nomenclature]
        else
          groups['name'] = claim.name
        end

        claim_aliases.each do |ca|
          if normalizable_ids.include? ca.nomenclature
            concept_ids << [ca.alias, ca.nomenclature]
          else
            groups['aliases'] << ca.alias
          end
        end

        groups['concept_ids'] = concept_ids
                                .sort_by! { |_, nomenclature| normalizable_ids.index(nomenclature) || Float::INFINITY }
                                .map { |concept_id| concept_id[0] }
        groups
      end

      # Try to determine grouping of a claim based on consensus of its aliases.
      # Iterate through aliases and tally all 'votes' for normalized concepts with the
      # highest match type. For example:
      # 1) if a gene has three aliases, and two match as `ALIASES` to gene A and the third
      # matches as an `ALIAS` to gene B, we pick gene A
      # 2) if a gene has five aliases, and one alias matches as a `LABEL` to gene A, but
      # the other four aliases match as `ALIASES` to gene B, we pick gene A, since `LABEL`
      # is the highest match type and there's no tie
      # 3) if a gene has five aliases, and two match as `LABELS` to different genes, we then
      # try to break the tie by looking at the votes for the next-best kind of match
      # 4) if a gene has four aliases, and two match as `LABELS` to different genes, and
      # the other two match as `ALIASES` to two different genes, we can't break any ties.
      # So, we just take the first `LABEL` match we saw (arbitrarily).
      # Experimentally, these lower conditions happen ~not at all, but we want to have
      # them to fall back on just in case.
      def normalize_claim_by_aliases(claim_aliases)
        alias_responses = {}
        match_votes = {
          100 => Hash.new(0),
          80 => Hash.new(0),
          60 => Hash.new(0)
        }
        claim_aliases.each do |claim_alias|
          response = retrieve_normalizer_response(claim_alias)
          match_type = response['match_type']
          next if response.nil? || match_type.zero?

          concept_id = response[@entity_type]['id']
          alias_responses[concept_id] = response unless alias_responses.key?(concept_id)
          match_votes[match_type][concept_id] += 1
        end

        # tally votes
        best_default = nil
        best_match = nil
        match_votes.keys.sort.reverse.each do |match_type|
          next unless best_match.nil?

          most_votes = match_votes[match_type].values.max
          next if most_votes.nil?

          highest_vote_getters = match_votes[match_type].select { |_key, value| value == most_votes }.keys
          if highest_vote_getters.length == 1
            best_match = highest_vote_getters[0]
          elsif highest_vote_getters.length > 1 && best_default.nil?
            best_default = highest_vote_getters[0]
          end
        end

        if !best_match.nil?
          alias_responses[best_match]
        elsif !best_default.nil?
          alias_responses[best_default]
        end
      end

      # Normalize claim based on name/alias terms. Return normalized concept ID
      # under which the claim should be grouped.
      # First, normalize by concept IDs from known namespaces. Go with the first one
      # to return a match.
      # If none match, then try to normalize by the claim name, if it wasn't included
      # in the search above.
      # Failing that, try to match based on consensus of other alias terms.
      # See `normalize_claim_by_aliases()`.
      def normalize_claim(claim, claim_aliases)
        term_search_groups = get_claim_search_groups(claim, claim_aliases)

        # try concept IDs. take first successful match
        term_search_groups['concept_ids'].each do |concept_id|
          normalized_id = retrieve_normalized_id(concept_id)
          return normalized_id unless normalized_id.nil?
        end

        # try claim name if it wasn't in a set of recognized concept ID nomenclatures
        unless term_search_groups['name'].nil?
          normalized_id = retrieve_normalized_id(term_search_groups['name'])
          return normalized_id unless normalized_id.nil?
        end

        normalize_claim_by_aliases(term_search_groups['aliases'])
      end

      def get_concept_id(response)
        response[@normalizer_entity_type]['id'].split('.', 3)[2] unless response['match_type'].zero?
      end

      def get_normalized_name(response)
        if response[@normalizer_entity_type]['name'].nil? || response[@normalizer_entity_type]['name'].blank?
          get_concept_id(response)
        else
          response[@normalizer_entity_type]['name']
        end
      end

      def retrieve_normalized_id(term)
        term_upcased = term.upcase
        return @term_to_normalized_id[term_upcased] if @term_to_normalized_id.key?(term_upcased)

        get_concept_id(retrieve_normalizer_response(term_upcased))
      end

      def retrieve_normalizer_response(term)
        term_upcased = term.upcase
        body = fetch_json_response("#{@normalizer_host}normalize?q=#{CGI.escape(term_upcased)}")
        @term_to_normalized_id[term_upcased] = get_concept_id(body) unless term_upcased == ''
        body
      end

      def key_non_nil_match(term)
        true if @term_to_match_dict.key?(term) && !@term_to_match_dict[term].nil?
      end

      def retrieve_extension(normalizer_response, type, default = nil)
        extensions = normalizer_response[@normalizer_entity_type].fetch('extensions')
        unless extensions.blank?
          extensions.each do |extension|
            return extension['value'] if extension['name'] == type
          end
        end
        default
      end

      def retrieve_grouper_records(term)
        body = fetch_json_response("#{@normalizer_host}normalize_unmerged?q=#{CGI.escape(term)}")
        body['source_matches']
      end
    end
  end
end
