module Genome
  module Groupers
    # Provides some shared methods for groupers, shouldn't be directly instantiated.
    class Base
      # Sends an empty query to concept normalizer to retrieve the service's version
      def retrieve_normalizer_version
        response = retrieve_normalizer_response('')
        response['service_meta_']['version']
      end

      # Normalize claim terms. `secondary_term` can be nil.
      def normalize_claim(primary_term, secondary_term, claim_aliases)
        primary_term_upcase = primary_term.upcase
        return @term_to_match_dict[primary_term_upcase] if key_non_nil_match(primary_term_upcase)

        response = retrieve_normalizer_response(primary_term)
        if response.nil? || response['match_type'].zero?
          unless secondary_term.nil? || primary_term == secondary_term
            secondary_term_upcase = secondary_term.upcase
            return @term_to_match_dict[secondary_term_upcase] if key_non_nil_match(secondary_term_upcase)

            response = retrieve_normalizer_response(secondary_term)
          end
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
        begin
          url = URI("#{@normalizer_url_root}normalize?q=#{term}")
        rescue URI::InvalidURIError
          return # TODO: pending resolution of non ASCII character lookups
        end
        response = Net::HTTP.get_response(url)

        unless response.is_a?(Net::HTTPSuccess)
          raise StandardError, "HTTP request to normalize term #{term} failed: #{url}"
        end

        body = JSON.parse(response.body)
        @term_to_match_dict[term.upcase] = get_concept_id(body) unless term == ''

        body
      end

      def key_non_nil_match(term)
        return true if @term_to_match_dict.key?(term) && !@term_to_match_dict[term].nil?
      end
    end
  end
end
