module Genome
  module Groupers
    class GeneGrouper < Genome::Groupers::Base
      attr_reader :term_to_match_dict

      def initialize
        url_base = ENV['GENE_URL_BASE'] || 'http://localhost:8000'
        @normalizer_url_root = "#{url_base}/gene/"

        @term_to_match_dict = {}
        @sources = {}

        @source_gene_type_names = {
          Ensembl: GeneAttributeName::ENSEMBL_TYPE,
          NCBI: GeneAttributeName::NCBI_TYPE,
          HGNC: GeneAttributeName::HGNC_TYPE
        }
      end

      def run(source_id = nil)
        claims = GeneClaim.eager_load(:gene_claim_aliases, :gene_claim_attributes).where(gene_id: nil)
        claims = claims.where(source_id: source_id) unless source_id.nil?
        if source_id.nil?
          puts "Grouping #{claims.length} ungrouped gene claims"
        else
          begin
            source = Source.find(source_id)
          rescue ActiveRecord::RecordNotFound
            puts 'Unrecognized source ID provided'
            return
          end
          source_name = source.source_db_name
          puts "Grouping #{claims.length} ungrouped gene claims from #{source_name}"
        end

        set_response_structure
        create_sources

        claims.tqdm.each do |gene_claim|
          normalized_gene = normalize_claim(gene_claim.name, gene_claim.gene_claim_aliases)
          next if normalized_gene.nil?

          if normalized_gene.is_a? String
            normalized_id = normalized_gene
          else
            normalized_id = normalized_gene[@descriptor_name][@id_name]
            create_new_gene normalized_gene[@descriptor_name] if Gene.find_by(concept_id: normalized_id).nil?
          end
          add_claim_to_gene(gene_claim, normalized_id)
        end
      end

      def set_response_structure
        @descriptor_name = 'gene_descriptor'

        url = URI("#{@normalizer_url_root}search?q=")
        body = fetch_json_response(url)
        version = body['service_meta_']['version']
        if version < '0.2.0'
          @id_name = 'gene_id'
        else
          @id_name = 'gene'
        end
      end

      def create_sources
        gene_source_type = SourceType.find_by(type: 'gene')

        source_meta = fetch_source_meta
        ncbi = Source.where(
          source_db_name: 'NCBI',
          source_db_version: source_meta['NCBI']['version'],
          base_url: 'https://www.ncbi.nlm.nih.gov/gene/',
          site_url: 'https://www.ncbi.nlm.nih.gov/gene/',
          citation: 'NCBI Resource Coordinators. Database resources of the National Center for Biotechnology Information. Nucleic Acids Res. 2016 Jan 4;44(D1):D7-19. doi: 10.1093/nar/gkv1290. Epub 2015 Nov 28. PMID: 26615191; PMCID: PMC4702911.',
          citation_short: 'NCBI Resource Coordinators. Database resources of the National Center for Biotechnology Information. Nucleic Acids Res. 2016 Jan 4;44(D1):D7-19.',
          pmid: '26615191',
          pmcid: 'PMC4702911',
          doi: '10.1093/nar/gkv1290',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'NCBI Gene',
          license: License::CUSTOM,
          license_link: 'https://www.ncbi.nlm.nih.gov/home/about/policies/'
        ).first_or_create
        hgnc = Source.where(
          source_db_name: 'HGNC',
          source_db_version: source_meta['HGNC']['version'],
          base_url: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/',
          site_url: 'https://www.genenames.org',
          citation: 'Tweedie S, Braschi B, Gray K, Jones TEM, Seal RL, Yates B, Bruford EA. Genenames.org: the HGNC and VGNC resources in 2021. Nucleic Acids Res. 2021 Jan 8;49(D1):D939-D946. doi: 10.1093/nar/gkaa980. PMID: 33152070; PMCID: PMC7779007.',
          citation_short: 'Tweedie S, et al. Genenames.org: the HGNC and VGNC resources in 2021. Nucleic Acids Res. 2021 Jan 8;49(D1):D939-D946.',
          pmid: '33152070',
          pmcid: 'PMC7779007',
          doi: '10.1093/nar/gkaa980',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'HUGO Gene Nomenclature Committee',
          license: License::CUSTOM,
          license_link: 'https://www.genenames.org/about/'
        ).first_or_create
        ensembl = Source.where(
          source_db_name: 'Ensembl',
          source_db_version: source_meta['Ensembl']['version'],
          base_url: 'https://ensembl.org/Homo_sapiens/Gene/Summary?g=',
          site_url: 'https://ensembl.org',
          citation: 'Cunningham F, Allen JE, Allen J, Alvarez-Jarreta J, Amode MR, Armean IM, Austine-Orimoloye O, Azov AG, Barnes I, Bennett R, Berry A, Bhai J, Bignell A, Billis K, Boddu S, Brooks L, Charkhchi M, Cummins C, Da Rin Fioretto L, Davidson C, Dodiya K, Donaldson S, El Houdaigui B, El Naboulsi T, Fatima R, Giron CG, Genez T, Martinez JG, Guijarro-Clarke C, Gymer A, Hardy M, Hollis Z, Hourlier T, Hunt T, Juettemann T, Kaikala V, Kay M, Lavidas I, Le T, Lemos D, Marugán JC, Mohanan S, Mushtaq A, Naven M, Ogeh DN, Parker A, Parton A, Perry M, Piližota I, Prosovetskaia I, Sakthivel MP, Salam AIA, Schmitt BM, Schuilenburg H, Sheppard D, Pérez-Silva JG, Stark W, Steed E, Sutinen K, Sukumaran R, Sumathipala D, Suner MM, Szpak M, Thormann A, Tricomi FF, Urbina-Gómez D, Veidenberg A, Walsh TA, Walts B, Willhoft N, Winterbottom A, Wass E, Chakiachvili M, Flint B, Frankish A, Giorgetti S, Haggerty L, Hunt SE, IIsley GR, Loveland JE, Martin FJ, Moore B, Mudge JM, Muffato M, Perry E, Ruffier M, Tate J, Thybert D, Trevanion SJ, Dyer S, Harrison PW, Howe KL, Yates AD, Zerbino DR, Flicek P. Ensembl 2022. Nucleic Acids Res. 2022 Jan 7;50(D1):D988-D995. doi: 10.1093/nar/gkab1049. PMID: 34791404; PMCID: PMC8728283.',
          citation_short: 'Cunningham F, et al. Ensembl 2022. Nucleic Acids Res. 2022 Jan 7;50(D1):D988-D995.',
          pmid: '34791404',
          pmcid: 'PMC8728283',
          doi: '10.1093/nar/gkab1049',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          full_name: 'Ensembl',
          license: License::CUSTOM,
          license_link: 'https://useast.ensembl.org/info/about/legal/disclaimer.html'
        ).first_or_create

        [ncbi, hgnc, ensembl].each do |source|
          unless source.source_types.include? gene_source_type
            source.source_types << gene_source_type
            source.save
          end
        end

        @sources = {
          Ensembl: ensembl,
          HGNC: hgnc,
          NCBI: ncbi
        }
      end

      def get_concept_id(response)
        response[@descriptor_name][@id_name] unless response['match_type'].zero?
      end

      def create_gene_claim(record, source)
        GeneClaim.where(
          name: record['symbol'],
          nomenclature: GeneNomenclature::SYMBOL,
          source_id: source.id
        ).first_or_create
      end

      def get_nomenclature(concept_id)
        case concept_id
        when /hgnc:/
          GeneNomenclature::HGNC_ID
        when /ensembl:/
          GeneNomenclature::ENSEMBL_ID
        when /ncbigene:/
          GeneNomenclature::NCBI_ID
        else
          GeneNomenclature::CONCEPT_ID
        end
      end

      def add_grouper_claim_aliases(claim, record)
        concept_id = record['concept_id']
        GeneClaimAlias.where(
          alias: concept_id,
          nomenclature: get_nomenclature(concept_id),
          gene_claim_id: claim.id
        ).first_or_create

        unless record['label'].nil?
          GeneClaimAlias.where(
            alias: record['label'],
            nomenclature: GeneNomenclature::DESCRIPTION,
            gene_claim_id: claim.id
          ).first_or_create
        end

        record.fetch('previous_symbols', []).each do |symbol|
          GeneClaimAlias.where(
            alias: symbol,
            nomenclature: GeneNomenclature::PREVIOUS_SYMBOL,
            gene_claim_id: claim.id
          ).first_or_create
        end

        record.fetch('aliases', []).each do |value|
          GeneClaimAlias.where(
            alias: value,
            nomenclature: GeneNomenclature::SYNONYM,
            gene_claim_id: claim.id
          ).first_or_create
        end

        xrefs = record.fetch('xrefs', []) + record.fetch('associated_with', [])
        xrefs.each do |xref|
          GeneClaimAlias.where(
            alias: xref,
            nomenclature: get_nomenclature(xref),
            gene_claim_id: claim.id
          ).first_or_create
        end
      end

      def add_grouper_claim_attribute(claim, record)
        record_gene_type = record['gene_type']
        return if record_gene_type.nil?

        GeneClaimAttribute.where(
          name: @source_gene_type_names[claim.source.source_db_name],
          value: record_gene_type,
          gene_claim_id: claim.id
        )
      end

      def add_grouper_data(gene, descriptor)
        gene_data = retrieve_normalizer_data(descriptor[@id_name])
        gene_data.each do |source_name, source_data|
          source = @sources[source_name.to_sym]

          source_data['records'].each do |record|
            claim = create_gene_claim(record, source)
            add_grouper_claim_aliases(claim, record)
            add_grouper_claim_attribute(claim, record)

            add_claim_to_gene(claim, gene.concept_id)
          end
        end
      end

      def create_new_gene(descriptor)
        name = if descriptor.fetch('label').blank?
                 descriptor[@id_name]
               else
                 descriptor['label']
               end
        gene = Gene.where(
          concept_id: descriptor[@id_name],
          name: name,
          long_name: retrieve_extension(descriptor, 'approved_name')
        ).first_or_create

        add_grouper_data(gene, descriptor)
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
        claim.gene_claim_aliases.map(&:alias).map(&:upcase).to_set.each do |claim_alias|
          if !existing_gene_aliases.member?(claim_alias)
            gene_alias = GeneAlias.create(
              alias: claim_alias,
              gene_id: gene.id
            )
          else
            gene_alias = GeneAlias.where(
              alias: claim_alias,
              gene_id: gene.id
            ).first
          end
          gene_alias.sources << claim.source unless gene_alias.sources.include?(claim.source)
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
        return if gene.nil?

        claim.gene_id = gene.id
        add_claim_aliases(claim, gene)
        add_claim_attributes(claim, gene)
        add_claim_categories(claim, gene)
        claim.save
      end
    end
  end
end
