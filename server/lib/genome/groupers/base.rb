module Genome
  module Groupers
    # Provide some shared methods for groupers, shouldn't be directly instantiated
    class Base
      def retrieve_normalizer_version
        response = retrieve_normalizer_response('query')
        response['service_meta_']['version']
      end

      def retrieve_normalizer_response(term)
        # # TODO: fetch from previous result
        # @term_to_match_dict.key? term
        begin
          url = URI("#{@normalizer_url_root}normalize?q=#{term}")
        rescue URI::InvalidURIError
          url = URI.parse(URI.escape("#{@normalizer_url_root}normalize?q=#{term}"))
        end
        response = Net::HTTP.get_response(url)
        return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)

        raise Exception, "HTTP request to normalize term #{term} failed: #{url}"
      end

      def normalize_claim(primary_term, secondary_term, claim_aliases)
        response = retrieve_normalizer_response(primary_term)
        if response['match_type'].zero?
          unless secondary_term.nil? || primary_term == secondary_term
            response = retrieve_normalizer_response(secondary_term)
          end
          if response['match_type'].zero?
            best_match = nil
            best_match_type = 0
            claim_aliases.each do |claim_alias|
              response = retrieve_normalizer_response(claim_alias.alias)
              if response['match_type'] > best_match_type
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
    end
  end
end
