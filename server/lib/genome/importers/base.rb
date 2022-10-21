require 'csv'

module Genome
  module Importers
    class Base
      attr_reader :source, :source_db_name

      def import
        @invalid_terms = {
          gene_claim_categories: {},
          interaction_claim_types: {}
        }
        remove_existing_source
        create_new_source
        create_claims

        print_invalid_terms
      end

      def print_invalid_terms
        unless @invalid_terms[:gene_claim_categories].empty?
          puts 'Skipped unrecognized gene claim categories:'
          @invalid_terms[:gene_claim_categories].each do |key, value|
            puts "#{key}: #{value.inspect}"
          end
        end
        unless @invalid_terms[:interaction_claim_types].empty?
          puts 'Skipped unrecognized interaction claim types:'
          @invalid_terms[:interaction_claim_types].each do |key, value|
            puts "#{key}: #{value.inspect}"
          end
        end
      end

      def default_filetype
        'tsv'
      end

      def default_filename
        'claims'
      end

      def handle_file_location(file_path)
        return file_path unless file_path.nil?

        dir_name = self.class.name.split('::')[-2].underscore
        "lib/data/#{dir_name}/#{default_filename}.#{default_filetype}"
      end

      def remove_existing_source
        Utils::Database.delete_source(source_db_name)
      end

      def create_new_source
        raise StandardError, 'Must implement #create_new_source in subclass'
      end

      def create_claims
        raise StandardError, 'Must implement #create_claims in subclass'
      end

      def create_gene_claim(gene_name, nomenclature = GeneNomenclature::SYMBOL)
        GeneClaim.where(
          name: gene_name.strip.upcase,
          nomenclature: nomenclature.strip,
          source_id: @source.id
        ).first_or_create
      end

      def create_gene_claim_alias(gene_claim, synonym, nomenclature)
        GeneClaimAlias.where(
          alias: synonym.to_s.strip.upcase,
          nomenclature: nomenclature.strip,
          gene_claim_id: gene_claim.id
        ).first_or_create
      end

      def create_gene_claim_attribute(gene_claim, name, value)
        GeneClaimAttribute.where(
          name: name.strip,
          value: value.strip,
          gene_claim_id: gene_claim.id
        ).first_or_create
      end

      def create_gene_claim_category(gene_claim, category)
        gene_category = GeneClaimCategory.find_by(name: category)
        if gene_category.nil?
          msg = "Unrecognized GeneClaimCategory #{category} from #{gene_claim.inspect}."
          raise StandardError, msg unless Rails.env == 'development'

          if @invalid_terms[:gene_claim_categories].key? category
            @invalid_terms[:gene_claim_categories][category] << gene_claim.id
          else
            @invalid_terms[:gene_claim_categories][category] = [gene_claim.id]
          end

          Rails.logger.debug msg
        else
          unless gene_claim.gene_claim_categories.include? gene_category
            gene_claim.gene_claim_categories << gene_category
          end
        end
      end

      def create_drug_claim(name, nomenclature=DrugNomenclature::PRIMARY_NAME, source=@source)
        DrugClaim.where(
          name: name.strip,
          nomenclature: nomenclature.strip,
          source_id: source.id
        ).first_or_create
      end

      def create_drug_claim_alias(drug_claim, synonym, nomenclature)
        cleaned = synonym.gsub(/[^\w_]+/,'').upcase
        return nil unless DrugAliasBlacklist.find_by(alias: cleaned).nil?

        DrugClaimAlias.where(
          alias: synonym.strip.upcase,
          nomenclature: nomenclature.strip,
          drug_claim_id: drug_claim.id
        ).first_or_create
      end

      def create_drug_claim_attribute(drug_claim, name, value)
        DrugClaimAttribute.where(
          name: name.strip,
          value: value.strip,
          drug_claim_id: drug_claim.id
        ).first_or_create
      end

      def create_drug_claim_approval_rating(drug_claim, rating)
        DrugClaimApprovalRating.where(
          rating: rating.strip.titleize,
          drug_claim_id: drug_claim.id
        ).first_or_create
      end

      def create_interaction_claim(gene_claim, drug_claim)
        InteractionClaim.where(
          gene_claim_id: gene_claim.id,
          drug_claim_id: drug_claim.id,
          source_id: @source.id
        ).first_or_create
      end

      def create_interaction_claim_type(interaction_claim, type)
        claim_type_value = Genome::Normalizers::InteractionClaimType.name_normalizer(type)
        if claim_type_value.nil?
          msg = "Unrecognized InteractionClaimType #{type} from #{interaction_claim.inspect}"
          raise StandardError, msg unless Rails.env == 'development'

          if @invalid_terms[:interaction_claim_types].key? type
            @invalid_terms[:interaction_claim_types][type] << interaction_claim.id
          else
            @invalid_terms[:interaction_claim_types][type] = [interaction_claim.id]
          end
          Rails.logger.debug msg
        else
          claim_type = InteractionClaimType.find_by(type: claim_type_value)
          unless interaction_claim.interaction_claim_types.include? claim_type
            interaction_claim.interaction_claim_types << claim_type
          end
        end
      end

      def create_interaction_claim_publication(interaction_claim, pmid)
        publication = Publication.where(
          pmid: pmid
        ).first_or_create
        interaction_claim.publications << publication unless interaction_claim.publications.include? publication
      end

      def create_interaction_claim_publication_by_pmcid(interaction_claim, pmcid)
        uri = URI.parse("https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=#{pmcid}&format=json&tool=DGIdb&email=help@dgidb.org")
        response_body = PMID.make_get_request(uri)
        pmid = JSON.parse(response_body)['records'][0]['pmid']
        create_interaction_claim_publication(interaction_claim, pmid) unless pmid.nil?
      end

      def backfill_publication_information
        Publication.where(citation: nil).find_in_batches(batch_size: 100) do |publications|
          PMID.get_citations_from_publications(publications).each do |publication, citation|
            publication.citation = citation
            publication.save
          end
          sleep(0.3)
        end
        Publication.where(citation: '').each do |publication|
          publication.destroy
        end
      end

      def create_interaction_claim_attribute(interaction_claim, name, value)
        InteractionClaimAttribute.where(
          name: name.to_s.strip,
          value: value.strip,
          interaction_claim_id: interaction_claim.id
        ).first_or_create
      end

      def create_interaction_claim_link(interaction_claim, link_text, link_url)
        InteractionClaimLink.where(
          interaction_claim_id: interaction_claim.id,
          link_text: link_text,
          link_url: link_url
        ).first_or_create
      end

      def set_current_date_version
        source_db_version = Date.today.strftime('%d-%B-%Y')
        @new_version = source_db_version
      end

      module License
        UNKNOWN_UNAVAILABLE = 'Unknown; data is no longer publicly available from site'.freeze
        UNKNOWN = 'Unknown'.freeze
        CC_BY_NC_3_0 = 'Creative Commons Attribution-NonCommercial 3.0 (BY-NC)'.freeze
        CC_BY_SA_3_0 = 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)'.freeze
        CC_BY_SA_4_0 = 'Create Commons Attribution-ShareAlike 4.0 International License'.freeze
        PUBLIC_DOMAIN = 'Public domain'.freeze
        CUSTOM_NON_COMMERCIAL = 'Custom Non-Commercial'.freeze
      end

      module DrugNomenclature
        PRIMARY_NAME = 'Primary Name'.freeze

        DEVELOPMENT_NAME = 'Development Name'.freeze
        ALIAS = 'ALIAS'.freeze
        TRADE_NAME = 'Trade Name'.freeze
        GENERIC_NAME = 'Generic Name'.freeze

        GTOP_LIGAND_NAME = 'GuideToPharmacology Ligand Name'.freeze
        DRUGBANK_ID = 'DrugBank ID'.freeze
        PHARMGKB_ID = 'PharmGKB ID'.freeze
        CHEMBL_ID = 'ChEMBL ID'.freeze
        PUBCHEM_COMPOUND_ID = 'PubChem Compound ID'.freeze
        PUBCHEM_SUBSTANCE_ID = 'PubChem Substance ID'.freeze
        NCIT_ID = 'NCIt ID'.freeze
        PFAM_ID = 'PFAM ID'.freeze
        TTD_ID = 'TTD ID'.freeze
      end

      module DrugAttributeName
        NOTES = 'Notes'.freeze
        DRUG_CLASS = 'Drug Class'.freeze
        DRUG_SUBCLASS = 'Drug Subclass'.freeze
        CLINICAL_TRIAL_ID = 'Clinical Trial ID'.freeze
        INDICATION = 'Indication'.freeze
        DEVELOPER = 'Developer'.freeze
        APPROVAL_YEAR = 'Year of Approval'.freeze
        CLEARITY_LINK = 'Link to Clearity Drug Class Schematic'.freeze
        SPECIES_NAME = 'Name of Ligand Species'.freeze
        GENE_SYMBOL = 'Gene Symbol for Endogenous Peptides'.freeze
      end

      module GeneNomenclature
        SYMBOL = 'Gene Symbol'.freeze
        NAME = 'Gene Name'.freeze
        SYNONYM = 'Gene Synonym'.freeze
        DESCRIPTION = 'Description'.freeze

        NCBI_NAME = 'NCBI Gene Name'.freeze
        NCBI_ID = 'NCBI Gene ID'.freeze
        REFSEQ_ACC = 'RefSeq Accession'.freeze
        ENSEMBL_ID = 'Ensembl Gene ID'.freeze
        HGNC_ID = 'HGNC ID'.freeze
        UNIPROTKB_ID = 'UniProtKB ID'.freeze
        UNIPROTKB_NAME = 'UniProtKB Entry Name'.freeze
        UNIPROTKB_PROTEIN_NAME = 'UniProtKB Protein Name'.freeze
        UNIPROTKB_GENE_NAME = 'UniProtKB Gene Name'.freeze
        CIVIC_ID = 'CIViC ID'.freeze
        TTD_ID = 'TTD ID'.freeze
        PHARMGKB_ID = 'PharmGKB ID'.freeze
        CHEMBL_ID = 'ChEMBL ID'.freeze
        GTOP_ID = 'GuideToPharmacology ID'.freeze
      end

      module GeneAttributeName
        GTOP_FAMILY_ID = 'GuideToPharmacology Family ID'.freeze
        GTOP_FAMILY_NAME = 'GuideToPharmacology Family Name'.freeze
        INTERPRO_ACC_ID = 'InterPro Accession ID'.freeze
        INTERPRO_NAME_SHORT = 'InterPro Short Name'.freeze
        INTERPRO_TYPE = 'InterPro Type'.freeze
        UNIPROTKB_EV = 'UniProtKB Evidence'.freeze
        UNIPROTKB_STATUS = 'UniProtKB Status'.freeze
        CITES = 'Counted Citations from 1950-2009'.freeze
        QUERY = 'Initial Gene Query'.freeze
        TARGET_EVENT = 'Reported Genome Event Targeted'.freeze
        CLASS = 'Target Class'.freeze
        MAIN_CLASS = 'Target Main Class'.freeze
        SUBCLASS = 'Target Subclass'.freeze
        HELIX_CT = 'Transmembrane Helix Count'.freeze
      end

      module InteractionAttributeName
        ALTERATION = 'Alteration'.freeze
        APPROVAL_STATUS = 'Approval Status'.freeze
        CLINICAL_TRIAL_ID = 'Clinical Trial ID'.freeze
        CLINICAL_TRIAL_NAME = 'Clinical Trial Name'.freeze
        COMBINATION = 'Combination Therapy'.freeze
        CONTEXT = 'Interaction Context'.freeze
        BINDING_SITE = 'Specific Binding Site'.freeze
        ASSAY = 'Assay Details'.freeze
        DETAILS = 'Details'.freeze
        ENDOGENOUS_DRUG = 'Endogenous Drug'.freeze
        DIRECT = 'Direct Interaction'.freeze
        EV_TYPE = 'Evidence Type'.freeze
        FUSION_PROTEIN = 'Fusion Protein'.freeze
        INDICATION = 'Indication'.freeze
        CANCER_TYPE = 'Cancer Type'.freeze
        MOA = 'Mechanism of Action'.freeze
        NOVEL = 'Novel Drug Target'.freeze
        PATHWAY = 'Pathway'.freeze
        RESPONSE = 'Response Type'.freeze
        VARIANT_EFFECT = 'Variant Effect'.freeze
      end
    end
  end
end
