module Genome
  module Groupers
    class GeneGrouper < Genome::Groupers::Base
      attr_reader :term_to_match_dict

      def initialize
        url_base = ENV['GENE_URL_BASE'] || 'http://localhost:8000'
        @normalizer_url_root = "#{url_base}/gene/"

        @term_to_match_dict = {} # key: lowercase gene term, value: normalized response
      end

      def run(source_id: nil)
        create_source
        claims = geneClaim.eager_load(:gene_claim_aliases, :gene_claim_attributes).where(gene_id: nil)
        claims = claims.where(source_id: source_id) unless source_id.nil?
        claims.each do |gene_claim|
          normalized_gene = normalize_claim(gene_claim.name, nil, gene_claim.gene_claim_aliases)
          next if normalized_gene.nil?

          normalized_id = normalized_gene['gene_descriptor']['gene_id']
          create_new_gene normalized_gene['gene_descriptor'] if gene.find_by(concept_id: normalized_id).nil?
          add_claim_to_gene(gene_claim, normalized_id)
        end
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

      def add_gene_types(descriptor)
        type_names = [
          ['hgnc_locus_type', 'HGNC Locus Type'],
          ['ncbi_gene_type', 'NCBI Gene Type'],
          ['ensembl_biotype', 'Ensembl Biotype']
        ]
        type_names.each do |field_name, attr_name|
          type_values = retrieve_extension(descriptor, field_name)
          type_values.each do |gene_type|
            attr = GeneAttribute.where(
              name: attr_name,
              value: gene_type
            ).first_or_create
            attr.sources << @normalizer_source unless attr.sources.member? @normalizer_source
          end
        end
      end

      def create_new_gene(descriptor)
        name = if descriptor.fetch('label').blank?
                 descriptor['gene_id']
               else
                 descriptor['label']
               end
        gene = Gene.where(concept_id: descriptor['gene_id'], name: name).first_or_create

        # add aliases
        alias_values = []
        xrefs = descriptor.fetch('xrefs')
        alias_values += xrefs unless xrefs.blank?
        alt_labels = descriptor.fetch('alternate_labels')
        alias_values += alt_labels unless alt_labels.blank?
        approved_names = retrieve_extension(descriptor, 'approved_name', [])
        alias_values += approved_names unless approved_names.empty?
        alias_values.map(&:upcase).to_set.each do |gene_alias|
          gene_alias = GeneAlias.where(alias: gene_alias, gene_id: gene.id).first_or_create
          gene_alias.sources << @normalizer_source unless gene_alias.sources.member? @normalizer_source
        end

        # add attributes
        add_gene_types descriptor
      end

      def add_attributes_to_gene(claim, gene)
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

      def add_aliases_to_gene(claim, gene)
        gene_aliases = gene.gene_aliases.pluck(:alias).map(&:upcase).to_set
        claim.gene_claim_aliases.each do |gene_claim_alias|
          if gene_aliases.member? gene_claim_alias
            gene_alias = GeneAlias.where(
              'upper(alias) = ?',
              gene_claim_alias.alias.upcase
            ).first
            if gene_alias.nil?
              gene_alias = GeneAlias.where(
                'lower(alias) = ?',
                gene_claim_alias.alias.downcase
              )
            end
            gene_alias.sources << claim.source unless gene_alias.sources.member? claim.source
          else
            gene_alias = GeneAlias.create(
              gene: gene,
              alias: gene_claim_alias.alias
            )
            gene_alias.sources << claim.source
          end
        end
      end

      def add_claim_to_gene(claim, gene_concept_id)
        gene = Gene.find_by(concept_id: gene_concept_id)
        add_attributes_to_drug(claim, gene)
        add_aliases_to_drug(claim, gene)
      end
    end
  end
end
