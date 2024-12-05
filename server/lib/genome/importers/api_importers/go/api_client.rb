require 'open-uri'

module Genome; module Importers; module ApiImporters; module Go;
  class PagesExhaustedError < StandardError; end

  class ApiClient
    def genes_for_go_id(id, start=0, rows=500)
      get_entries(gene_lookup_base_url(id), start, rows)
    end

    def get_entries(url, start, rows)
      uri = URI.parse(url).tap do |u|
        u.query = URI.encode_www_form(params(start, rows))
      end
      body = make_get_request(uri, start == 0)
      JSON.parse(body)
    end

    def make_get_request(uri, is_start)
      puts uri
      res = Net::HTTP.get_response(uri)
      if res.code == '200'
        res.body
      else
        if !is_start && res.code == '404'
          raise PagesExhaustedError, "Received 404 from #{uri}: inferring page exhaustion. See https://github.com/dgidb/dgidb-v5/pull/542 if this is unexpected."
        else
          raise StandardError, "Request for #{uri} failed with code #{res.code}."
        end
      end
    end

    def gene_lookup_base_url(id)
      "https://api.geneontology.org/api/bioentity/function/GO:#{id}"
    end

    def params(start, rows)
      {
        'start' => start,
        'rows' => rows
      }
    end
  end
end; end; end; end
