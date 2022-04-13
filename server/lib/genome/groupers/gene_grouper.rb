module Genome
  module Groupers
    # TODO:
    # * figure out where guys like this 'α' are and how to handle them
    class GeneGrouper < Genome::Groupers::Base
      attr_reader :term_to_match_dict

      def initialize
        url_base = ENV['GENE_URL_BASE'] || 'http://localhost:8000'
        @normalizer_url_root = "#{url_base}/gene/"

        @term_to_match_dict = {}
      end

      def run(source_id: nil)
        create_source
        claims = GeneClaim.eager_load(:gene_claim_aliases, :gene_claim_attributes).where(gene_id: nil)
        claims = claims.where(source_id: source_id) unless source_id.nil?
        claims.each do |gene_claim|
          normalized_gene = normalize_claim(gene_claim.name, nil, gene_claim.gene_claim_aliases)
          next if normalized_gene.nil?

          if normalized_gene.is_a? String
            normalized_id = normalized_gene
          else
            normalized_id = normalized_gene['gene_descriptor']['gene_id']
            create_new_gene normalized_gene['gene_descriptor'] if Gene.find_by(concept_id: normalized_id).nil?
          end
          add_claim_to_gene(gene_claim, normalized_id)
        end
      end

      def get_concept_id(response)
        response['gene_descriptor']['gene_id'] unless response['match_type'].zero?
      end

      def create_source
        @normalizer_source = Source.where(
          source_db_name: 'VICCGeneNormalizer',
          source_db_version: retrieve_normalizer_version,
          base_url: 'https://normalize.cancervariants.org/gene/normalize?q=',
          site_url: 'https://normalize.cancervariants.org/gene/', # TODO
          citation: '', # TODO
          source_trust_level_id: SourceTrustLevel.NON_CURATED,
          full_name: 'VICC Gene Normalizer',
          license: 'custom', # TODO
          license_link: 'TBD' # TODO
        ).first_or_create
        gene_source_type = SourceType.find_by(type: 'gene')
        return if @normalizer_source.source_types.include? gene_source_type

        @normalizer_source.source_types << gene_source_type
        @normalizer_source.save
      end

      def add_grouper_types(descriptor, gene)
        type_names = [
          ['hgnc_locus_type', 'HGNC Locus Type'],
          ['ncbi_gene_type', 'NCBI Gene Type'],
          ['ensembl_biotype', 'Ensembl Biotype']
        ]
        type_names.each do |field_name, attr_name|
          gene_type = retrieve_extension(descriptor, field_name)
          next if gene_type.nil?

          attr = GeneAttribute.where(
            name: attr_name,
            value: gene_type,
            gene_id: gene.id
          ).first_or_create
          attr.sources << @normalizer_source unless attr.sources.member? @normalizer_source
          attr.save
        end
      end

      def add_grouper_aliases(descriptor, gene)
        alias_values = []
        xrefs = descriptor.fetch('xrefs')
        alias_values += xrefs unless xrefs.blank?
        alt_labels = descriptor.fetch('alternate_labels')
        alias_values += alt_labels.map(&:upcase) unless alt_labels.blank?
        alias_values.to_set.each do |gene_alias|
          gene_alias = GeneAlias.where(alias: gene_alias, gene_id: gene.id).first_or_create
          gene_alias.sources << @normalizer_source unless gene_alias.sources.member? @normalizer_source
        end
      end

      def create_new_gene(descriptor)
        name = if descriptor.fetch('label').blank?
                 descriptor['gene_id']
               else
                 descriptor['label']
               end
        gene = Gene.where(
          concept_id: descriptor['gene_id'],
          name: name,
          long_name: retrieve_extension(descriptor, 'approved_name')
        ).first_or_create

        add_grouper_types(descriptor, gene)
        add_grouper_aliases(descriptor, gene)
      end

      def add_claim_attributes(claim, gene)
        gene_attributes = gene.gene_attributes.pluck(:name, :value)
                              .map { |gene_attribute| gene_attribute.map(&:upcase) }
                              .to_set
        claim.gene_claim_attributes.each do |gene_claim_attribute|
          if gene_attributes.member? [gene_claim_attribute.name.upcase, gene_claim_attribute.value.upcase]
            gene_attribute = GeneAttribute.where(
              'upper(name) = ? and upper(value) = ?',
              gene_claim_attribute.name.upcase,
              gene_claim_attribute.value.upcase
            ).first
            if gene_attribute.nil? # this can occur when a character (e.g. α) is treated differently by upper and upcase
              gene_attribute = GeneAttribute.where(
                'lower(name) = ? and lower(value) = ?',
                gene_claim_attribute.name.downcase,
                gene_claim_attribute.value.downcase
              ).first
            end
            gene_attribute.sources << claim.source unless gene_attribute.sources.member? claim.source
          else
            gene_attribute = GeneAttribute.create(
              name: gene_claim_attribute.name,
              value: gene_claim_attribute.value,
              gene: gene
            )
            gene_attribute.sources << claim.source
          end
        end
      end

      def add_claim_aliases(claim, gene)
        existing_gene_aliases = gene.gene_aliases.pluck(:alias).to_set
        claim.gene_claim_aliases.each do |claim_alias|
          if !existing_gene_aliases.member?(claim_alias)
            gene_alias = GeneAlias.create(alias: claim_alias.alias)
          else
            gene_alias = GeneAlias.where(
              'alias = ?',
              claim_alias.alias
            ).first
          end
          gene_alias.sources << claim.source
          gene_alias.save
        end
      end

      def add_claim_categories(claim, gene)
        existing_categories = gene.gene_categories.pluck(:name).to_set
        claim.gene_claim_categories.each do |claim_category|
          next if existing_categories.member? claim_category.name

          gene_category = GeneClaimCategory.where('name = ?', claim_category.name)
          gene.gene_categories << gene_category
          gene.save
        end
      end

      def add_claim_to_gene(claim, gene_concept_id)
        gene = Gene.find_by(concept_id: gene_concept_id)
        claim.gene_id = gene.id
        add_claim_aliases(claim, gene)
        add_claim_attributes(claim, gene)
        add_claim_categories(claim, gene)
        claim.save
      end
    end
  end
end
