module Genome
  module Groupers
    # Provides some shared methods for groupers, shouldn't be directly instantiated.
    class Base < Genome::DataImporter
      # Sends an empty query to concept normalizer to retrieve the service's version
      def retrieve_normalizer_version
        response = retrieve_normalizer_response('')
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

      # Normalize claim terms
      # If the primary term normalizes successfully, go with that. Otherwise, iterate
      # through claims and tally all 'votes' for normalized concepts with the highest match
      # type. For example:
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
      def normalize_claim(primary_term, claim_aliases)
        primary_term_upcase = primary_term.upcase
        return @term_to_match_dict[primary_term_upcase] if key_non_nil_match(primary_term_upcase)

        response = retrieve_normalizer_response(primary_term)
        if response.nil? || response['match_type'].zero?
          claim_responses = Hash.new
          match_votes = {
            100 => Hash.new(0),
            80 => Hash.new(0),
            60 => Hash.new(0),
          }
          claim_aliases.each do |claim_alias|
            response = retrieve_normalizer_response(claim_alias.alias)
            match_type = response['match_type']
            if !response.nil? && match_type > 0
              concept_id = response[@descriptor_name]['id'][15..]
              if !claim_responses.key?(concept_id)
                claim_responses[concept_id] = response
              end
              match_votes[match_type][concept_id] += 1
            end
          end

          # tally votes
          best_default = nil
          best_match = nil
          match_votes.keys.sort.reverse.each do |match_type|
            next if !best_match.nil?
            most_votes = match_votes[match_type].values.max
            next if most_votes.nil?
            highest_vote_getters = match_votes[match_type].select {|_key, value| value == most_votes}.keys
            if highest_vote_getters.length == 1
              best_match = highest_vote_getters[0]
            elsif highest_vote_getters.length > 1 && best_default.nil?
              best_default = highest_vote_getters[0]
            end
          end
          if !best_match.nil?
            response = claim_responses[best_match]
          elsif !best_default.nil?
            response = claim_responses[best_default]
          else
            response = nil
          end
        end
        response
      end

      def retrieve_extension(descriptor, type, default = nil)
        unless descriptor.fetch('extensions').blank?
          descriptor['extensions'].each do |extension|
            return extension['value'] if extension['name'] == type
          end
        end
        default
      end

      def retrieve_normalizer_response(term)
        body = fetch_json_response("#{@normalizer_host}normalize?q=#{CGI.escape(term)}")
        @term_to_match_dict[term.upcase] = get_concept_id(body) unless term == '' || body.nil?

        body
      end

      def key_non_nil_match(term)
        return true if @term_to_match_dict.key?(term) && !@term_to_match_dict[term].nil?
      end

      def retrieve_normalizer_data(term)
        body = fetch_json_response("#{@normalizer_host}normalize_unmerged?q=#{CGI.escape(term)}")
        body['source_matches']
      end
    end
  end
end
