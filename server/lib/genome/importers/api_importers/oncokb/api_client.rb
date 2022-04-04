module Genome; module Importers; module ApiImporters; module Oncokb;
  class ApiClient
    def variants
      get_data(variant_base_url, {})
    end

    def genes
      get_data(gene_base_url, {})
    end

    def drugs
      get_data(drug_base_url, {})
    end

    def gene_for_name(name)
      get_data(gene_lookup_base_url, gene_params(name))
    end

    def drug_for_name(name)
      get_data(drug_lookup_base_url, drug_params(name))
    end

    def data_version
      get_data('https://www.oncokb.org/api/v1/info', {})['dataVersion']['version']
    end

    private

    def get_data(base_url, params)
      uri = URI.parse(base_url).tap do |u|
        u.query = URI.encode_www_form(params)
      end
      body = make_get_request(uri)
      JSON.parse(body)
    end

    def make_get_request(uri)
      Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        req = Net::HTTP::Get.new uri
        req.add_field('Authorization', 'Bearer 343a8a7b-c9d2-4243-aed4-aa47000b0b8b')

        response = http.request req
        return response.body
      end
    end

    def variant_base_url
      'https://oncokb.org/api/v1/utils/allActionableVariants'
    end

    def gene_base_url
      # TODO: looks like we gotta fix
      'https://oncokb.org/api/v1/genes'
    end

    def gene_loopup_base_url
      # TODO: looks like we gotta fix
      'https://oncokb.org/api/v1/genes/lookup'
    end

    def gene_params(name)
      {
        'query' => name
      }
    end

    def drug_base_url
      'https://oncokb.org/api/v1/drugs'
    end

    def drug_loopkup_base_url
      'https://oncokb.org/api/v1/drugs/lookup'
    end

    def drug_params(name)
      {
        'name' => name,
        'exactMatch' => 'true'
      }
    end
  end
end; end; end; end
