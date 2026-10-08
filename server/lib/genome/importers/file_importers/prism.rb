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
            'MUTPOOL' => 'MUTpool',
            'MUT' => 'RMUTmis',
            'MUTMIS' => 'RMUTmis',
            'MUTHOT' => 'RMUThot',
            'MUTDMG' => 'RMUTdmg'
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

          # Feature names include a bunch of extra window dressing;
          # We need to parse out the actual genomic feature differently depending on feature set type
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
            when 'CN', 'DEMETER2_COM', 'AVANA_PUBLIC_18Q2', 'MUTPOOL', 'MUT', 'MUTDMG', 'MUTHOT', 'MUTMIS'
              prefix = NCBI_FEATURE_PREFIXES.fetch(normalized_feature_set)
              gene_claim = ingest_ncbi_feature(feature_name, prefix)
            when 'METHYL'
              gene_name = feature_name.sub(/\AMETHYL_/i, '').strip
              return if gene_name.empty?

              gene_claim = create_gene_claim(gene_name)
            end
            gene_claim
          end

          # Only attempt ingest from these feature sets
          INCLUDED_FEATURE_SETS = %w[
            PROT
            GE
            CN
            DEMETER2_COM
            AVANA_PUBLIC_18Q2
            MUTPOOL
            MUT
            MUTDMG
            MUTHOT
            MUTMIS
            METHYL
          ].freeze

          # QC cutoff taken directly from Corsello et al
          # 'Models with Pearson correlations greater than 0.2 are considered to be strong models.'
          PEARSON_SCORE_CUTOFF = 0.2

          FEATURE_SET_DESCRIPTIONS = {
            'PROT' => 'Protein abundance (PROT)',
            'GE' => 'Gene expression (GE)',
            'CN' => 'Copy number (CN)',
            'DEMETER2_COM' => 'RNAi gene dependency (DEMETER2_COM)',
            'AVANA_PUBLIC_18Q2' => 'CRISPR gene dependency (AVANA_PUBLIC_18Q2)',
            'MUTPOOL' => 'Pooled mutation status (MUTpool)',
            'MUT' => 'Mutation status (MUT)',
            'MUTDMG' => 'Damaging mutation status (MUTdmg)',
            'MUTHOT' => 'Hotspot mutation status (MUThot)',
            'MUTMIS' => 'Missense mutation status (MUTmis)',
            'METHYL' => 'DNA methylation (METHYL)'
          }.freeze

          # eg "Gene expression (GE); original feature: Exp_EGFR (ENSG00000146648)"
          def interaction_context_value(feature_set, feature_name)
            normalized_feature_set = feature_set.strip.upcase
            description = FEATURE_SET_DESCRIPTIONS.fetch(normalized_feature_set)

            "#{description} (#{feature_set.strip}); original feature: #{feature_name.strip}"
          end

          # eg "ATLANTIS predictive model; Pearson score: 0.42; sample size: 123; screen: MTS010; dose: 2.5 µM"
          def assay_details_value(pearson_score:, sample_size: nil, screen_id: nil, dose: nil)
            details = [
              'ATLANTIS predictive model',
              "Pearson score: #{pearson_score}"
            ]

            details << "sample size: #{sample_size}" if sample_size.to_s.strip != ''
            details << "screen: #{screen_id}" if screen_id.to_s.strip != ''
            details << "dose: #{dose}" if dose.to_s.strip != ''

            details.join('; ')
          end

          def create_interaction_claims
            CSV.foreach(file_path, headers: true, col_sep: "\t", skip_lines: /^#/) do |row|
              feature_set = row['feature_set']&.strip&.upcase
              next unless INCLUDED_FEATURE_SETS.include?(feature_set)

              pearson_score = Float(row['pearson_score'], exception: false)
              next unless pearson_score && pearson_score > PEARSON_SCORE_CUTOFF

              gene_claim = ingest_feature(row['top_feature'], row['feature_set'])
              next if gene_claim.nil?

              drug_claim = create_drug_claim(row['name'])
              interaction_claim = create_interaction_claim(gene_claim, drug_claim)
              context_value = interaction_context_value(
                feature_set,
                row['top_feature']
              )
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::CONTEXT,
                                                 context_value)

              assay_value = assay_details_value(
                pearson_score: row['pearson_score'].strip,
                sample_size: row['sample_size'],
                screen_id: row['screen_id'],
                dose: row['dose']
              )
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::ASSAY,
                                                 assay_value)
            end
          end
        end
      end
    end
  end
end
