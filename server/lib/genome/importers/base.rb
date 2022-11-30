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

      def create_gene_claim(gene_name, nomenclature)
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

      def create_drug_claim(name, nomenclature, source=@source)
        DrugClaim.where(
          name: name.strip,
          nomenclature: nomenclature.strip,
          source_id: source.id
        ).first_or_create!
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
    end
  end
end
