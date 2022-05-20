module Genome
  module Groupers
    # Provides some shared methods for groupers, shouldn't be directly instantiated.
    class Base
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
        url = URI("#{@normalizer_url_root}search?q=")
        body = fetch_json_response(url)
        body['source_matches'].reduce({}) { |map, source| map.update(source['source'] => source['source_meta_']) }
      end

      # Normalize claim terms.
      def normalize_claim(primary_term, claim_aliases)
        primary_term_upcase = primary_term.upcase
        return @term_to_match_dict[primary_term_upcase] if key_non_nil_match(primary_term_upcase)

        response = retrieve_normalizer_response(primary_term)
        if response.nil? || response['match_type'].zero?
          best_match = nil
          best_match_type = 0
          claim_aliases.each do |claim_alias|
            response = retrieve_normalizer_response(claim_alias.alias)
            if !response.nil? && response['match_type'] > best_match_type
              best_match = response
              best_match_type = response['match_type']
            end
          end
          response = best_match
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
        body = fetch_json_response("#{@normalizer_url_root}normalize?q=#{term}")
        @term_to_match_dict[term.upcase] = get_concept_id(body) unless term == '' || body.nil?

        body
      end

      def key_non_nil_match(term)
        return true if @term_to_match_dict.key?(term) && !@term_to_match_dict[term].nil?
      end

      def retrieve_normalizer_data(term)
        body = fetch_json_response("#{@normalizer_url_root}normalize_unmerged?q=#{term}")
        body['source_matches']
      end
    end
  end
end
