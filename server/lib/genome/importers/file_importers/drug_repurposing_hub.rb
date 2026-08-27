require 'csv'

module Genome
  module Importers
    module FileImporters
      module DrugRepurposingHub
        class Importer < Genome::Importers::Base
          attr_reader :file_path

          def handle_file_location(file_path)
            return file_path unless file_path.nil?

            directory = "#{default_data_dir}/drug_repurposing_hub/"
            puts directory
            Dir.glob(File.join(directory, 'drug_repurposing_hub_annotations_*.txt')).select do |path|
              File.basename(path) =~ /^drug_repurposing_hub_annotations_(\d{8})\.txt$/
            end.max_by do |path|
              File.basename(path)[/^drug_repurposing_hub_annotations_(\d{8})\.txt$/, 1]
            end
          end

          def initialize(file_path)
            @file_path = handle_file_location file_path
            @data_version = File.basename(@file_path)[/^drug_repurposing_hub_annotations_(\d{8})\.txt$/, 1]
            @source_db_name = 'Drug Repurposing Hub'
          end

          def create_claims
            create_interaction_claims
          end

          private

          def create_new_source
            @source ||= Source.create(
              {
                base_url: 'https://repo-hub.broadinstitute.org/',
                site_url: 'https://repo-hub.broadinstitute.org/repurposing#home',
                citation: 'Corsello SM, Bittker JA, Liu Z, Gould J, McCarren P, Hirschman JE, Johnston SE, Vrcic A, Wong B, Khan M, Asiedu J, Narayan R, Mader CC, Subramanian A, Golub TR. The Drug Repurposing Hub: a next-generation drug library and information resource. Nat Med. 2017 Apr 7;23(4):405-408. doi: 10.1038/nm.4306. PMID: 28388612; PMCID: PMC5568558.',
                citation_short: 'Corsello SM, et al. The Drug Repurposing Hub: a next-generation drug library and information resource. Nat Med. 2017 Apr 7;23(4):405-408.',
                pmid: '28388612',
                pmcid: 'PMC5568558',
                doi: '10.1038/nm.4306',
                source_db_version: @data_version,
                source_db_name: source_db_name,
                full_name: source_db_name,
                license: 'CC-BY 4.0',
                license_link: 'https://repo-hub.broadinstitute.org/repurposing#about'
              }
            )
            @source.source_types << SourceType.find_by(type: 'interaction')
            @source.save
          end

          def ingest_drug(row)
            drug_claim = create_drug_claim(row[0], DataImporter::DrugNomenclature::PRIMARY_NAME)
            create_drug_claim_approval_rating(drug_claim, row[1]) unless row[1].blank?
            drug_claim
          end

          def create_interaction_claims
            rows = CSV.foreach(@file_path, col_sep: "\t").reject { |row| row[0]&.start_with?('!') }
            rows.drop(1).each do |row|
              drug_claim = ingest_drug(row)
              next if row[3].blank?

              row[3].split('|').each do |target|
                gene_claim = create_gene_claim(target)
                interaction_claim = create_interaction_claim(gene_claim, drug_claim)
                unless row[2].blank?
                  create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::MOA,
                                                     row[2])
                end
              end
            end
          end
        end
      end
    end
  end
end
