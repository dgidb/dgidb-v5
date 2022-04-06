module Genome
  module Groupers
    class DrugGrouper
      attr_reader :term_to_match_dict

      def initialize
        @term_to_match_dict = {} # key: lowercase drug term, value: normalized response
        @normalizer_source = Source.where(
          source_db_name: 'VICCTherapyNormalizer',
          source_db_version: 'TBD', # TODO
          base_url: 'https://normalize.cancervariants.org/therapy/normalize?q=',
          site_url: 'https://normalize.cancervariants.org/therapy/', # TODO
          citation: '', # TODO
          source_trust_level_id: SourceTrustLevel.NON_CURATED,
          full_name: 'VICC Therapy Normalizer',
          license: 'custom', # TODO
          license_link: 'TBD' # TODO
        ).first_or_create
        drug_source_type = SourceType.find_by(type: 'drug')
        unless @normalizer_source.source_types.include? drug_source_type
          @normalizer_source.source_types << drug_source_type
          @normalizer_source.save
        end
      end

      def run(source_id: nil)
        claims = DrugClaim.eager_load(:drug_claim_aliases, :drug_claim_attributes).where(drug_id: nil)
        claims = claims.where(source_id: source_id) unless source_id.nil?
        claims.each do |drug_claim|
          normalized_drug = normalize_claim(drug_claim)
          next if normalized_drug.nil?

          normalized_id = normalized_drug['therapy_descriptor']['therapy_id']
          create_new_drug normalized_drug['therapy_descriptor'] if Drug.find_by(concept_id: normalized_id).nil?
          add_claim_to_drug(drug_claim, normalized_id)
        end
      end

      def default_therapy_url_base
        'http://localhost:8000/'
      end

      def retrieve_normalizer_response(term)
        @term_to_match_dict.key? term
        therapy_url_base = ENV['THERAPY_URL_BASE'] || default_therapy_url_base
        url = URI("#{therapy_url_base}therapy/normalize?q=#{term.upcase}")
        response = Net::HTTP.get_response(url)
        return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)

        raise Exception, "HTTP request to normalize drug term #{term} failed"
      end

      def normalize_claim(drug_claim)
        response = retrieve_normalizer_response(drug_claim.primary_name)
        if response['match_type'].zero?
          response = retrieve_normalizer_response(drug_claim.name)
          if response['match_type'].zero?
            best_match = nil
            best_match_type = 0
            drug_claim.drug_claim_aliases.each do |claim_alias|
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

      def retrieve_extension(descriptor, type)
        unless descriptor.fetch('extensions').blank?
          descriptor['extensions'].each do |extension|
            return extension['value'] if extension['name'] == type
          end
        end
        []
      end

      def create_new_drug(descriptor)
        name = if descriptor.fetch('label').blank?
                 descriptor['therapy_id']
               else
                 descriptor['label']
               end
        drug = Drug.where(concept_id: descriptor['therapy_id'], name: name).first_or_create

        alias_values = []
        xrefs = descriptor.fetch('xrefs')
        # skip Drugs@FDA refs for now
        alias_values += xrefs.reject { |xref| xref =~ /drugsatfda.\.*/ } unless xrefs.blank?
        alt_labels = descriptor.fetch('alternate_labels')
        alias_values += alt_labels unless alt_labels.blank?
        trade_names = retrieve_extension(descriptor, 'trade_names')
        alias_values += trade_names unless trade_names.blank?
        alias_values.map(&:upcase).to_set.each do |drug_alias|
          DrugAlias.where(alias: drug_alias, drug_id: drug.id).first_or_create
        end

        regulatory_approval = retrieve_extension(descriptor, 'regulatory_approval')
        return if regulatory_approval.blank?

        regulatory_approval.fetch('approval_year', []).each do |year|
          DrugAttribute.create(name: 'Year of Approval', value: year, drug: drug)
        end
        regulatory_approval.fetch('approval_ratings', []).each do |rating|
          DrugAttribute.create(name: 'Approval Rating', value: rating, drug: drug)
        end
        regulatory_approval.fetch('has_indication', []).map { |ind| ind['label'] }.to_set.each do |indication|
          DrugAttribute.create(name: 'Drug Indications', value: indication, drug: drug)
        end
      end

      def add_attributes_to_drug(claim, drug)
        drug_attributes = drug.drug_attributes.pluck(:name, :value)
                              .map { |drug_attribute| drug_attribute.map(&:upcase) }
                              .to_set
        claim.drug_claim_attributes.each do |drug_claim_attribute|
          if drug_attributes.member? [drug_claim_attribute.name.upcase, drug_claim_attribute.value.upcase]
            drug_attribute = DataModel::DrugAttribute.where(
              'upper(name) = ? and upper(value) = ?',
              drug_claim_attribute.name.upcase,
              drug_claim_attribute.value.upcase
            ).first
            if drug_attribute.nil? # this can occur when a character (e.g. α) is treated differently by upper and upcase
              drug_attribute = DrugAttribute.where(
                'lower(name) = ? and lower(value) = ?',
                drug_claim_attribute.name.downcase,
                drug_claim_attribute.value.downcase
              ).first
            end
            drug_attribute.sources << drug_claim.source unless drug_attribute.sources.member? drug_claim.source
          else
            drug_attribute = DrugAttribute.create(
              name: drug_claim_attribute.name,
              value: drug_claim_attribute.value,
              drug: drug
            )
            drug_attribute.sources << drug_claim.source
          end
        end
      end

      def add_aliases_to_drug(claim, drug)
        drug_aliases = drug.drug_aliases.pluck(:alias).map(&:upcase).to_set
        claim.drug_claim_aliases.each do |drug_claim_alias|
          DrugAlias.create(alias: drug_claim_alias.alias, drug: drug) unless drug_aliases.member? drug_claim_alias.alias
        end
      end

      def add_claim_to_drug(claim, drug_concept_id)
        drug = Drug.find_by(concept_id: drug_concept_id)
        add_attributes_to_drug(claim, drug)
        add_aliases_to_drug(claim, drug)
      end
    end
  end
end
