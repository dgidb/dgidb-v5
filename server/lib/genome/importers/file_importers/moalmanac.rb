# frozen_string_literal: true

require 'json'

module Genome
  module Importers
    module FileImporters
      module Moalmanac
        # Imports interaction claims from MOAlmanac JSON exports.
        class Importer < Genome::Importers::Base
          attr_reader :file_path

          def handle_file_location(file_path)
            return file_path unless file_path.nil?

            directory = "#{default_data_dir}/moalmanac/"
            Dir.glob(File.join(directory, 'moalmanac_*.json')).select do |path|
              File.basename(path) =~ /^moalmanac_(\d{8})\.json$/
            end.max_by do |path|
              File.basename(path)[/^moalmanac_(\d{8})\.json$/, 1]
            end
          end

          def initialize(file_path)
            @file_path = handle_file_location file_path
            @data_version = JSON.parse(File.read(@file_path)).dig('about', 'last_updated')
            @source_db_name = 'MOAlmanac'
          end

          def create_claims
            create_interaction_claims
          end

          private

          def create_new_source
            @source ||= Source.create(
              {
                base_url: 'https://dev.moalmanac.org/statements/',
                site_url: 'https://moalmanac.org/',
                citation: 'Reardon B, Moore ND, Moore NS, Kofman E, AlDubayan SH, Cheung ATM, Conway J, Elmarakeby H, Imamovic A, Kamran SC, Keenan T, Keliher D, Konieczkowski DJ, Liu D, Mouw KW, Park J, Vokes NI, Dietlein F, Van Allen EM. Integrating molecular profiles into clinical frameworks through the Molecular Oncology Almanac to prospectively guide precision oncology. Nat Cancer. 2021 Oct;2(10):1102-1112. doi: 10.1038/s43018-021-00243-3. Epub 2021 Sep 30. PMID: 35121878; PMCID: PMC9082009.',
                citation_short: 'Reardon B, et al. Integrating molecular profiles into clinical frameworks through the Molecular Oncology Almanac to prospectively guide precision oncology. Nat Cancer. 2021 Oct;2(10):1102-1112.',
                pmid: '35121878',
                pmcid: 'PMC9082009',
                doi: '10.1038/s43018-021-00243-3',
                source_db_version: @data_version,
                source_db_name: source_db_name,
                full_name: 'Molecular Oncology Almanac',
                license: 'ODbL',
                license_link: 'https://moalmanac.org/terms'
              }
            )
            @source.source_types << SourceType.find_by(type: 'interaction')
            @source.save
          end

          def ingest_drug(drug_record)
            drug_claim = create_drug_claim(drug_record['name'], DrugNomenclature::TRADE_NAME)
            create_drug_claim_alias(drug_claim, "moa.tid:#{drug_record['id']}", DrugNomenclature::MOA_TID)
            create_drug_claim_alias(drug_claim, drug_record['primaryCoding']['id'], DrugNomenclature::NCIT_ID)
            drug_record['extensions'].each do |extension|
              case extension['value']
              when String
                create_drug_claim_attribute(drug_claim, extension['name'], extension['value'])
              when Array
                extension['value'].each do |value|
                  create_drug_claim_attribute(drug_claim, extension['name'], value) if value.is_a?(String)
                end
              end
            end
            drug_claim
          end

          def ingest_gene(gene_record)
            gene_claim = create_gene_claim(gene_record['name'], GeneNomenclature::SYMBOL)
            if gene_record.dig(
              'primaryCoding', 'code'
            )
              create_gene_claim_alias(gene_claim, gene_record['primaryCoding']['code'],
                                      GeneNomenclature::HGNC_ID)
            end
            gene_claim
          end

          def ingest_interaction(gene_record, drug_record, statement)
            gene_claim = ingest_gene(gene_record)
            drug_claim = ingest_drug(drug_record)
            interaction_claim = create_interaction_claim(gene_claim, drug_claim)
            create_interaction_claim_link(interaction_claim, 'MOAlmanac Statement', "https://dev.moalmanac.org/statements/#{statement['id']}")
            if statement['proposition']['objectTherapeutic'].key? 'membershipOperator'
              combo_therapy_value = statement['proposition']['objectTherapeutic']['therapies'].filter_map do |obj|
                obj['name']
              end.join(', ')
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::COMBINATION,
                                                 combo_therapy_value)
            end
            if statement.key? 'indication'
              create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::INDICATION,
                                                 statement['indication']['description'])
            end
            return unless statement.dig('indication', 'document', 'documentType') == 'Regulatory approval'

            create_drug_claim_approval_rating(drug_claim, 'Approved')
          end

          def create_interaction_claims
            data = JSON.parse(File.read(@file_path))

            data['content'].each do |statement|
              therapeutic = statement['proposition']['objectTherapeutic']
              drug_records = if therapeutic.key?('membershipOperator')
                               therapeutic['therapies']
                             else
                               [therapeutic]
                             end

              biomarkers = statement['proposition']['biomarkers']
              unless biomarkers.one?
                # these might not be meaningful for our purposes, so we want to ignore them for now
                ignored_biomarkers = [
                  'HER2-negative',
                  'ER positive',
                  'ER negative',
                  'PR positive',
                  'PR negative',
                  'dMMR'
                ]
                ignored_patterns = [
                  /\APD-L1.*>=/
                ]
                biomarkers = biomarkers.reject do |biomarker|
                  name = biomarker['name']

                  name &&
                    (
                      ignored_biomarkers.include?(name) ||
                      ignored_patterns.any? { |pattern| name.match?(pattern) }
                    )
                end
                next unless biomarkers.one?
              end

              genes = biomarkers.first['genes']

              if genes.nil?
                biomarker = biomarkers.first
                if biomarker['name'] == 'CD22 +'
                  gene_record = { 'name' => 'CD22' }
                elsif biomarker['name'] == 'CD19 +'
                  gene_record = { 'name' => 'CD19' }
                else
                  next
                end
              elsif genes&.length != 1
                # special case -- pull out ABL1 interaction for BCR-ABL1 fusions
                next unless genes.map { |g| g['name'] }.sort == %w[ABL1 BCR]

                gene_record = [genes.find { |g| g['name'] == 'ABL1' }].first
              elsif genes&.length == 1
                gene_record = genes.first
              else
                next
              end

              drug_records.each do |drug_record|
                ingest_interaction(gene_record, drug_record, statement)
              end
            end
          end
        end
      end
    end
  end
end
