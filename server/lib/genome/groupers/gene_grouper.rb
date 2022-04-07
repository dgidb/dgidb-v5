module Genome
  module Groupers
    class GeneGrouper
      def initialize
        @term_to_match_dict = {} # key: lowercase gene term, value: normalized response
        @normalizer_source = Source.where(
          source_db_name: 'VICCGeneNormalizer',
          source_db_version: 'TBD', # TODO
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

      def run(source_id: nil)
        claims = geneClaim.eager_load(:gene_claim_aliases, :gene_claim_attributes).where(gene_id: nil)
        claims = claims.where(source_id: source_id) unless source_id.nil?
        claims.each do |gene_claim|
          normalized_gene = normalize_claim(gene_claim)
          next if normalized_gene.nil?

          normalized_id = normalized_gene['gene_descriptor']['gene_id']
          create_new_gene normalized_gene['gene_descriptor'] if gene.find_by(concept_id: normalized_id).nil?
          add_claim_to_gene(gene_claim, normalized_id)
        end
      end

      def default_gene_url_base
        'http://localhost:8000/'
      end

      def retrieve_normalizer_response(term)
        @term_to_match_dict.key? term
        gene_url_base = ENV['GENE_URL_BASE'] || default_gene_url_base
        url = URI("#{gene_url_base}gene/normalize?q=#{term.upcase}")
        response = Net::HTTP.get_response(url)
        return JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)

        raise Exception, "HTTP request to normalize gene term #{term} failed"
      end

      def normalize_claim(gene_claim)
        response = retrieve_normalizer_response(gene_claim.primary_name)
        if response['match_type'].zero?
          response = retrieve_normalizer_response(gene_claim.name)
          if response['match_type'].zero?
            best_match = nil
            best_match_type = 0
            gene_claim.gene_claim_aliases.each do |claim_alias|
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

      def retrieve_extension(descriptor, type, default: [])
        extensions = []
        unless descriptor.fetch('extensions').blank?
          descriptor['extensions'].each do |extension|
            extensions << extension['value'] if extension['name'] == type
          end
        end
        return extensions unless extensions.empty?

        default
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
        add_gene_types descriptor
      end

      # TODO: add gene categories or whatever

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
              gene_attribute = geneAttribute.where(
                'lower(name) = ? and lower(value) = ?',
                gene_claim_attribute.name.downcase,
                gene_claim_attribute.value.downcase
              ).first
            end
            gene_attribute.sources << gene_claim.source unless gene_attribute.sources.member? gene_claim.source
          else
            gene_attribute = geneAttribute.create(
              name: gene_claim_attribute.name,
              value: gene_claim_attribute.value,
              gene: gene
            )
            gene_attribute.sources << gene_claim.source
          end
        end
      end



      #########################################################
      def run(source_id: nil)
        begin
          newly_added_claims_count = 0
          gene_claims_not_in_groups(source_id).find_in_batches do |claims|
            ActiveRecord::Base.transaction do
              grouped_claims = add_members(claims)
              newly_added_claims_count += grouped_claims.length
              if grouped_claims.length > 0
                add_attributes(grouped_claims)
                add_categories(grouped_claims)
              end
            end
          end
        end until newly_added_claims_count == 0
        Utils::Database.destroy_empty_groups
        Utils::Database.destroy_unsourced_attributes
        Utils::Database.destroy_unsourced_aliases
        Utils::Database.destroy_unsourced_gene_categories
      end

      def add_members(claims)
        grouped_claims = []
        claims.each do |gene_claim|
          grouped_claims << group_gene_claim(gene_claim)
        end
        return grouped_claims.compact
      end

      def group_gene_claim(gene_claim)
        if (gene = DataModel::Gene.where('upper(name) = ? or upper(long_name) = ?', gene_claim.name.upcase, gene_claim.name.upcase)).one?
          add_gene_claim_to_gene(gene_claim, gene.first)
          return gene_claim
        end

        gene_claim.gene_claim_aliases.each do |gene_claim_alias|
          if (gene = DataModel::Gene.where('upper(name) = ? or upper(long_name) = ?', gene_claim_alias.alias.upcase, gene_claim_alias.alias.upcase)).one?
            add_gene_claim_to_gene(gene_claim, gene.first)
            return gene_claim
          end
        end

        if (gene_alias = DataModel::GeneAlias.where('upper(alias) = ?', gene_claim.name.upcase)).one?
          add_gene_claim_to_gene(gene_claim, gene_alias.first.gene)
          return gene_claim
        end

        gene_claim.gene_claim_aliases.each do |gene_claim_alias|
          if (gene_alias = DataModel::GeneAlias.where('upper(alias) = ?', gene_claim_alias.alias.upcase)).one?
            add_gene_claim_to_gene(gene_claim, gene_alias.first.gene)
            return gene_claim
          end
        end

        return nil
      end

      def create_gene_alias(gene_id, name, source)
          if (existing_gene_alias = DataModel::GeneAlias.where(
            'gene_id = ? and upper(alias) = ?', gene_id, name.upcase
          )).any?
            gene_alias = existing_gene_alias.first
          else
            gene_alias = DataModel::GeneAlias.where(
              gene_id: gene_id,
              alias: name
            ).first_or_create
          end
          unless gene_alias.sources.include? source
            gene_alias.sources << source
          end
      end

      def add_gene_claim_to_gene(gene_claim, gene)
        gene_claim.gene = gene
        gene_claim.save

        if (gene.name.upcase != gene_claim.name.upcase)
          create_gene_alias(gene.id, gene_claim.name, gene_claim.source)
        end

        gene_claim.gene_claim_aliases.each do |gca|
          if (gene.name.upcase != gca.alias.upcase)
            create_gene_alias(gene.id, gca.alias, gene_claim.source)
          end
        end
      end

      def gene_claims_not_in_groups(source_id)
        claims = DataModel::GeneClaim.eager_load(:gene, :gene_claim_aliases)
          .where('gene_claims.gene_id IS NULL')
        unless source_id.nil?
          claims = claims.where(source_id: source_id)
        end
        return claims
      end

      def add_attributes(claims)
        claims.each do |gene_claim|
          gene_claim.gene_claim_attributes.each do |gca|
            gene_attribute = DataModel::GeneAttribute.where(
              gene_id: gene_claim.gene_id,
              name: gca.name,
              value: gca.value
            ).first_or_create
            unless gene_attribute.sources.include? gene_claim.source
              gene_attribute.sources << gene_claim.source
            end
            gene_attribute.save
          end
        end
      end

      def add_categories(claims)
        claims.each do |gene_claim|
          gene = gene_claim.gene
          gene_claim.gene_claim_categories.each do |category|
            unless gene.gene_categories.include? category
              gene.gene_categories << category
            end
          end
        end
      end

    end
  end
end

