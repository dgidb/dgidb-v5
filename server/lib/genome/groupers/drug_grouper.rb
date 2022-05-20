module Genome
  module Groupers
    class DrugGrouper < Genome::Groupers::Base
      attr_reader :term_to_match_dict

      def initialize
        url_base = ENV['THERAPY_URL_BASE'] || 'http://localhost:8000'
        @normalizer_url_root = "#{url_base}/therapy/"

        @term_to_match_dict = {}

        @sources = {}
      end

      def run(source_id = nil)
        claims = DrugClaim.eager_load(:drug_claim_aliases, :drug_claim_attributes).where(drug_id: nil)
        claims = claims.where(source_id: source_id) unless source_id.nil?
        if source_id.nil?
          puts "Grouping #{claims.length} ungrouped drug claims"
        else
          begin
            source = Source.find(source_id)
          rescue ActiveRecord::RecordNotFound
            puts 'Unrecognized source ID provided'
            return
          end
          source_name = source.source_db_name
          puts "Grouping #{claims.length} ungrouped drug claims from #{source_name}"
        end

        create_sources

        claims.each do |drug_claim|
          normalized_drug = normalize_claim(drug_claim.name, drug_claim.drug_claim_aliases)
          next if normalized_drug.nil?

          if normalized_drug.is_a? String
            normalized_id = normalized_drug
          else
            normalized_id = normalized_drug['therapy_descriptor']['therapy_id']
            create_new_drug(normalized_drug['therapy_descriptor']) if Drug.find_by(concept_id: normalized_id).nil?
          end
          add_claim_to_drug(drug_claim, normalized_id)
        end
      end

      def create_sources
        drug_source_type = SourceType.find_by(type: 'drug')

        source_meta = fetch_source_meta

        rxnorm = Source.where(
          source_db_name: 'RxNorm',
          source_db_version: source_meta['RxNorm']['version'],
          base_url: 'https://rxnav.nlm.nih.gov/REST/rxcui/rxcui/allrelated.xml',
          site_url: 'https://www.nlm.nih.gov/research/umls/rxnorm/overview.html',
          citation: 'Nelson SJ, Zeng K, Kilbourne J, Powell T, Moore R. Normalized names for clinical drugs: RxNorm at 6 years. J Am Med Inform Assoc. 2011 Jul-Aug;18(4)441-8. doi: 10.1136/amiajnl-2011-000116. Epub 2011 Apr 21. PubMed PMID: 21515544; PubMed Central PMCID: PMC3128404.',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'RxNorm',
          license: 'Custom; UMLS Metathesaurus',
          license_link: source_meta['RxNorm']['data_license_url']
        ).first_or_create
        ncit = Source.where(
          source_db_name: 'NCIt',
          source_db_version: source_meta['NCIt']['version'],
          base_url: 'https://ncithesaurus.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&code=',
          site_url: 'https://ncithesaurus.nci.nih.gov/ncitbrowser/pages/home.jsf',
          citation: 'Nicholas Sioutos, Sherri de Coronado, Margaret W. Haber, Frank W. Hartel, Wen-Ling Shaiu, and Lawrence W. Wright. 2007. NCI Thesaurus: A semantic model integrating cancer-related clinical and molecular information. J. of Biomedical Informatics 40, 1 (February, 2007), 30–43. https://doi.org/10.1016/j.jbi.2006.02.013',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'National Cancer Institute Thesaurus',
          license: source_meta['NCIt']['data_license'],
          license_link: source_meta['NCIt']['data_license_url']
        ).first_or_create
        hemonc = Source.where(
          source_db_name: 'HemOnc',
          source_db_version: source_meta['HemOnc']['version'],
          base_url: 'https://hemonc.org',
          site_url: 'https://hemonc.org',
          citation: 'Warner JL, Dymshyts D, Reich CG, Gurley MJ, Hochheiser H, Moldwin ZH, Belenkaya R, Williams AE, Yang PC. HemOnc: A new standard vocabulary for chemotherapy regimen representation in the OMOP common data model. J Biomed Inform. 2019 Aug;96:103239. doi: 10.1016/j.jbi.2019.103239. Epub 2019 Jun 22. PMID: 31238109; PMCID: PMC6697579.',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'HemOnc.org - A Free Hematology/Oncology Reference',
          license: source_meta['HemOnc']['data_license'],
          license_link: source_meta['HemOnc']['data_license_url']
        ).first_or_create
        drugsatfda = Source.where(
          source_db_name: 'Drugs@FDA',
          source_db_version: source_meta['DrugsAtFDA']['version'],
          base_url: 'https://www.accessdata.fda.gov/scripts/cder/daf/',
          site_url: 'https://www.accessdata.fda.gov/scripts/cder/daf/',
          citation: 'Center for Drug Evaluation and Research (U.S.). 2004. Drugs@FDA. Washington D.C.: U.S. Food and Drug Administration, Center for Drug and Evaluation Research. http://www.accessdata.fda.gov/scripts/cder/drugsatfda/.',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'Drugs@FDA',
          license: source_meta['DrugsAtFDA']['data_license'],
          license_link: source_meta['DrugsAtFDA']['data_license_url']
        ).first_or_create
        chemidplus = Source.where(
          source_db_name: 'ChemIDplus',
          source_db_version: source_meta['ChemIDplus']['version'],
          base_url: 'https://chem.nlm.nih.gov/chemidplus/rn/',
          site_url: 'https://chem.nlm.nih.gov/chemidplus/',
          citation: 'Tomasulo, Patricia. "ChemIDplus-super source for chemical and drug information." Medical reference services quarterly 21, no. 1 (2002): 53-59.',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'ChemIDplus',
          license: 'Custom',
          license_link: 'https://www.nlm.nih.gov/databases/download/terms_and_conditions.html'
        ).first_or_create
        wikidata = Source.where(
          source_db_name: 'Wikidata',
          source_db_version: source_meta['Wikidata']['version'],
          base_url: 'https://www.wikidata.org/wiki/',
          site_url: 'https://www.wikidata.org/',
          citation: 'Denny Vrandečić and Markus Krötzsch. 2014. Wikidata: a free collaborative knowledgebase. Commun. ACM 57, 10 (October 2014), 78–85. https://doi.org/10.1145/2629489',
          source_trust_level_id: SourceTrustLevel.NON_CURATED,
          full_name: 'Wikidata',
          license: source_meta['Wikidata']['data_license'],
          license_link: source_meta['Wikidata']['data_license_url']
        ).first_or_create

        [rxnorm, ncit, hemonc, drugsatfda, chemidplus, wikidata].each do |source|
          unless source.source_types.include? drug_source_type
            source.source_types << drug_source_type
            source.save
          end
        end

        @sources = {
          RxNorm: rxnorm,
          NCIt: ncit,
          HemOnc: hemonc,
          DrugsAtFDA: drugsatfda,
          ChemIDplus: chemidplus,
          Wikidata: wikidata
        }
      end

      def get_concept_id(response)
        response['therapy_descriptor']['therapy_id'] unless response['match_type'].zero?
      end

      def create_drug_claim(record, source)
        # Drugs@FDA records don't have unique labels
        if record['label'].nil? || source.source_db_name == 'Drugs@FDA'
          DrugClaim.where(
            name: record['concept_id'],
            nomenclature: 'Concept ID',
            source_id: source.id
          ).first_or_create
        else
          DrugClaim.where(
            name: record['label'],
            nomenclature: 'Primary Drug Name',
            source_id: source.id
          ).first_or_create
        end
      end

      def add_grouper_claim_attributes(claim, record)
        approval_ratings = record.fetch('approval_ratings', [])
        unless approval_ratings.nil?
          approval_ratings.to_set.each do |rating|
            DrugClaimAttribute.where(name: 'Approval Rating', value: rating, drug_claim_id: claim.id).first_or_create
          end
        end

        record.fetch('approval_year', []).to_set.each do |year|
          DrugClaimAttribute.create(name: 'Year of Approval', value: year, drug_claim_id: claim.id)
        end

        indications = record.fetch('has_indication')
        unless indications.nil?
          indications.filter_map { |ind| ind['label'].upcase unless ind['label'].nil? }.to_set.each do |indication|
            DrugClaimAttribute.create(name: 'Drug Indications', value: indication, drug_claim_id: claim.id)
          end
        end
      end

      def add_grouper_claim_alias(value, claim_name, claim_id, nomenclature)
        return if value == claim_name

        return nil unless DrugAliasBlacklist.find_by(alias: value).nil?

        DrugClaimAlias.where(alias: value, drug_claim_id: claim_id, nomenclature: nomenclature)
      end

      def prune_alias_list(alias_list)
        alias_list.map { |a| a.upcase.gsub(/[^\w_]+/, '') }.to_set
      end

      def add_grouper_claim_aliases(claim, record)
        claim_name = claim.name

        unless record['concept_id'] == claim_name
          add_grouper_claim_alias(record['concept_id'], claim_name, claim.id, 'Concept ID')
        end

        unless record['label'].nil? || record['label'] == claim_name
          add_grouper_claim_alias(record['label'], claim_name, claim.id, 'Concept ID')
        end

        prune_alias_list(record.fetch('aliases', [])).each do |value|
          add_grouper_claim_alias(value, claim_name, claim.id, 'Alias')
        end

        prune_alias_list(record.fetch('trade_names', [])).each do |value|
          add_grouper_claim_alias(value, claim_name, claim.id, 'Trade Name')
        end

        prune_alias_list(record.fetch('xrefs', [])).each do |value|
          add_grouper_claim_alias(value, claim_name, claim.id, 'Xref')
        end
      end

      def add_grouper_data(drug, descriptor)
        drug_data = retrieve_normalizer_data(descriptor['therapy_id'])

        drug_data.each do |source_name, source_data|
          next if %w[DrugBank ChEMBL GuideToPHARMACOLOGY].include?(source_name)

          source = @sources[source_name.to_sym]
          source_data['records'].each do |record|
            claim = create_drug_claim(record, source)
            add_grouper_claim_aliases(claim, record)
            add_grouper_claim_attributes(claim, record)

            add_claim_to_drug(claim, drug.concept_id)
          end
        end
      end

      def create_new_drug(descriptor)
        name = if descriptor.fetch('label').blank?
                 descriptor['therapy_id']
               else
                 descriptor['label']
               end
        drug = Drug.where(concept_id: descriptor['therapy_id'], name: name.upcase).first_or_create

        add_grouper_data(drug, descriptor)
      end

      def find_drug_attribute(drug_claim_attribute)
        drug_attribute = DrugAttribute.where(
          'upper(name) = ? and upper(value) = ?',
          drug_claim_attribute.name.upcase,
          drug_claim_attribute.value.upcase
        ).first
        if drug_attribute.nil?
          drug_attribute = DrugAttribute.where(
            'lower(name) = ? and lower(value) = ?',
            drug_claim_attribute.name.downcase,
            drug_claim_attribute.value.downcase
          ).first
        end
        drug_attribute
      end

      def add_claim_attributes(claim, drug)
        drug_attributes = drug.drug_attributes.pluck(:name, :value)
                              .map { |drug_attribute| drug_attribute.map(&:upcase) }
                              .to_set
        claim.drug_claim_attributes.each do |drug_claim_attribute|
          if drug_attributes.member? [drug_claim_attribute.name.upcase, drug_claim_attribute.value.upcase]
            drug_attribute = find_drug_attribute(drug_claim_attribute)
          else
            drug_attribute = DrugAttribute.create(
              name: drug_claim_attribute.name,
              value: drug_claim_attribute.value,
              drug: drug
            )
          end
          unless drug_attribute.sources.member? claim.source
            drug_attribute.sources << claim.source
            drug_attribute.save
          end
        end
      end

      def add_claim_aliases(claim, drug)
        drug_aliases = drug.drug_aliases.pluck(:alias).map(&:upcase).to_set
        drug_claim_aliases = claim.drug_claim_aliases.pluck(:alias)
        unless claim.name == drug.name || claim.name == drug.concept_id || claim.source.source_db_name == 'Drugs@FDA'
          drug_claim_aliases.append(claim.name)
        end
        drug_claim_aliases.map(&:upcase).to_set.each do |claim_alias|
          DrugAlias.create(alias: claim_alias, drug: drug) unless drug_aliases.member? claim_alias
        end
      end

      def add_application(claim, drug)
        DrugApplication.create(app_no: claim.name, drug: drug)
        # TODO ?
      end

      def add_claim_to_drug(claim, drug_concept_id)
        drug = Drug.find_by(concept_id: drug_concept_id)
        return if drug.nil?

        claim.drug_id = drug.id
        claim.save
        add_claim_attributes(claim, drug)
        add_claim_aliases(claim, drug)
        add_application(claim, drug) if claim.source.source_db_name == 'Drugs@FDA'
      end
    end
  end
end
