module Genome
  module Importers
    module FileImporters
      module Prism
        class Importer < Genome::Importers::Base
          attr_reader :file_path

          def initialize(file_path)
            @file_path = handle_file_location file_path
            @source_db_name = 'PRISM'
          end

          def create_claims
            create_interaction_claims
          end

          private

          def create_new_source
            @source ||= Source.create(
              {
                site_url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7328899/',
                citation: "Corsello SM, Nagari RT, Spangler RD, Rossen J, Kocak M, Bryan JG, Humeidi R, Peck D, Wu X, Tang AA, Wang VM, Bender SA, Lemire E, Narayan R, Montgomery P, Ben-David U, Garvie CW, Chen Y, Rees MG, Lyons NJ, McFarland JM, Wong BT, Wang L, Dumont N, O'Hearn PJ, Stefan E, Doench JG, Harrington CN, Greulich H, Meyerson M, Vazquez F, Subramanian A, Roth JA, Bittker JA, Boehm JS, Mader CC, Tsherniak A, Golub TR. Discovering the anti-cancer potential of non-oncology drugs by systematic viability profiling. Nat Cancer. 2020 Feb;1(2):235-248. doi: 10.1038/s43018-019-0018-6. Epub 2020 Jan 20. PMID: 32613204; PMCID: PMC7328899.",
                citation_short: 'Corsello SM, et al. Discovering the anti-cancer potential of non-oncology drugs by systematic viability profiling. Nat Cancer. 2020 Feb;1(2):235-248. doi: 10.1038/s43018-019-0018-6. Epub 2020 Jan 20.',
                pmid: '32613204',
                doi: '10.1038/s43018-019-0018-6',
                source_db_version: '20-Jan-2020',
                source_db_name: source_db_name,
                full_name: 'Systemic viability profiling of anti-cancer drugs (Corsello, et al., 2020)',
                license: 'Supplementary data from Nature Publishing Group copyright publication',
                license_link: 'https://www.nature.com/articles/s43018-019-0018-6'
              }
            )
            @source.source_types << SourceType.find_by(type: 'potentially_druggable')
            @source.save
          end

          # used for defining and parsing feature sets using a common feature naming convention
          NCBI_FEATURE_PREFIXES = {
            'CN' => 'CN',
            'DEMETER2_COM' => 'DEM2',
            'AVANA_PUBLIC_18Q2' => 'CRISPR',
            'MUTPOOL' => 'MUTpool'
          }.freeze

          def ingest_ncbi_feature(feature_name, prefix)
            match = feature_name.match(
              /\A#{Regexp.escape(prefix)}_(?<gene_name>[^&]+?)\s+\((?<ncbi_gene_id>\d+)\)\s*\z/i
            )
            return unless match

            gene_claim = create_gene_claim(match[:gene_name].strip)
            create_gene_claim_alias(
              gene_claim,
              "ncbigene:#{match[:ncbi_gene_id]}",
              GeneNomenclature::NCBI_ID
            )

            gene_claim
          end

          def ingest_feature(feature_name, feature_set)
            normalized_feature_set = feature_set.strip.upcase
            case normalized_feature_set
            when 'GE'
              match = feature_name.match(
                /\AExp_(?<gene_name>.+?)\s+\((?<ensembl_id>ENSG\d+)\)\z/i
              )
              return unless match

              gene_claim = create_gene_claim(match[:gene_name])
              create_gene_claim_alias(gene_claim, "ensembl:#{match[:ensembl_id].upcase}", GeneNomenclature::ENSEMBL_ID)
            when 'PROT'
              gene_name = feature_name.sub(/\APROT_/i, '')
              annotation_suffix = /
                (?:
                  \s*_?Caution |
                  (?:_|\s+)p[STY]\d+(?:_p?[STY]\d+)* |
                  \(CST\d+\)
                )\z
              /ix

              # Repeat to handle combinations such as "_pY1068_Caution".
              loop do
                cleaned_name = gene_name.sub(annotation_suffix, '')
                break if cleaned_name == gene_name

                gene_name = cleaned_name
              end

              gene_name = gene_name.tr('_', ' ').gsub(/\s+/, ' ').strip
              return if gene_name.empty?

              gene_claim = create_gene_claim(gene_name)
            when 'CN', 'DEMETER2_COM', 'AVANA_PUBLIC_18Q2', 'MUTPOOL'
              prefix = NCBI_FEATURE_PREFIXES.fetch(normalized_feature_set)
              gene_claim = ingest_ncbi_feature(feature_name, prefix)
            end
            gene_claim
          end

          INCLUDED_FEATURE_SETS = %w[
            PROT
            GE
            CN
            DEMETER2_COM
            AVANA_PUBLIC_18Q2
            MUTPOOL
          ].freeze

          PEARSON_SCORE_CUTOFF = 0.2

          def create_interaction_claims
            CSV.foreach(file_path, headers: true, col_sep: "\t", skip_lines: /^#/) do |row|
              feature_set = row['feature_set']&.strip&.upcase
              next unless INCLUDED_FEATURE_SETS.include?(feature_set)

              pearson_score = Float(row['pearson_score'], exception: false)
              next unless pearson_score && pearson_score > PEARSON_SCORE_CUTOFF

              gene_claim = ingest_feature(row['top_feature'], row['feature_set'])
              next if gene_claim.nil?

              drug_claim = create_drug_claim(row['name'])
              create_interaction_claim(gene_claim, drug_claim)
            end
          end
        end
      end
    end
  end
end
