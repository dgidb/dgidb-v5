module Genome
  module Importers
    module FileImporters
      module Clinpgx
        class Importer < Genome::Importers::Base
          attr_reader :file_path

          def initialize(file_path)
            @file_path = handle_file_location file_path
            @source_db_name = 'ClinPGx'
          end

          def create_claims
            create_interaction_claims
          end

          private

          def handle_file_location(file_path)
            return file_path unless file_path.nil?

            directory = "#{default_data_dir}/clinpgx/"
            Dir.glob(File.join(directory, 'clinpgx_*.tsv')).max
          end

          def get_version
            match = @file_path.match(/(\d{8})/)
            match ? match[1] : nil
          end

          def create_new_source
            @source ||= Source.create(
              {
                base_url: 'http://www.clinpgx.org',
                site_url: 'http://www.clinpgx.org/',
                citation: 'Whirl-Carrillo M, Huddart R, Gong L, Sangkuhl K, Thorn CF, Whaley R, Klein TE. An Evidence-Based Framework for Evaluating Pharmacogenomics Knowledge for Personalized Medicine. Clin Pharmacol Ther. 2021 Sep;110(3):563-572. doi: 10.1002/cpt.2350. Epub 2021 Jul 22. PMID: 34216021; PMCID: PMC8457105.',
                citation_short: 'Whirl-Carrillo M, et al. An Evidence-Based Framework for Evaluating Pharmacogenomics Knowledge for Personalized Medicine. Clin Pharmacol Ther. 2021 Sep;110(3):563-572.',
                pmid: '34216021',
                pmcid: 'PMC8457105',
                doi: '10.1002/cpt.2350',
                source_db_version: get_version,
                source_db_name: source_db_name,
                full_name: 'ClinPGx',
                license: License::CC_BY_SA_4_0,
                license_link: 'https://www.clinpgx.org/page/dataUsagePolicy'
              }
            )
            @source.source_types << SourceType.find_by(type: 'interaction')
            @source.save
          end

          def create_interaction_claims
            CSV.foreach(file_path, headers: true,
                                   col_sep: "\t") do |row|
              next if ['not associated',
                       'ambiguous'].include?(row['Association'])

              if row['Entity1_type'] == 'Gene' && row['Entity2_type'] == 'Chemical'
                gene_name = row['Entity1_name']
                clinpgx_gene_id = row['Entity1_id']
                drug_name = row['Entity2_name']
                clinpgx_drug_id = row['Entity2_id']
                drug_claim = create_drug_claim(drug_name)
                create_drug_claim_alias(drug_claim,
                                        "clinpgx.drug:#{clinpgx_drug_id}", DrugNomenclature::CLINPGX_ID)
                gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
                create_gene_claim_alias(gene_claim,
                                        "clinpgx.gene:#{clinpgx_gene_id}", GeneNomenclature::CLINPGX_ID)
                interaction_claim = create_interaction_claim(
                  gene_claim, drug_claim
                )
                create_interaction_claim_link(interaction_claim,
                                              'ClinPGx interaction', "https://www.clinpgx.org/combination/#{clinpgx_gene_id},#{clinpgx_drug_id}/overview")
                if row['PMIDs'].present?
                  add_interaction_claim_publications(
                    interaction_claim, row['PMIDs']
                  )
                end
              elsif row['Entity1_type'] == 'Chemical' && row['Entity2_type'] == 'Gene'
                drug_name = row['Entity1_name']
                clinpgx_drug_id = row['Entity1_id']
                gene_name = row['Entity2_name']
                clinpgx_gene_id = row['Entity2_id']
                drug_claim = create_drug_claim(drug_name)
                create_drug_claim_alias(drug_claim,
                                        "clinpgx.drug:#{clinpgx_drug_id}", DrugNomenclature::CLINPGX_ID)
                gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
                create_gene_claim_alias(gene_claim,
                                        "clinpgx.gene:#{clinpgx_gene_id}", GeneNomenclature::CLINPGX_ID)
                interaction_claim = create_interaction_claim(
                  gene_claim, drug_claim
                )
                create_interaction_claim_link(interaction_claim,
                                              'ClinPGx interaction', "https://www.clinpgx.org/combination/#{clinpgx_gene_id},#{clinpgx_drug_id}/overview")
                if row['PMIDs'].present?
                  add_interaction_claim_publications(interaction_claim,
                                                     row['PMIDs'])
                end
              end
            end
            backfill_publication_information
          end

          def add_interaction_claim_publications(interaction_claim,
                                                 source_string)
            if source_string.include?(';')
              source_string.split(';').each do |value|
                value.split(/[^\d]/).each do |pmid|
                  next if pmid.nil? || pmid == ''

                  create_interaction_claim_publication(
                    interaction_claim, pmid
                  )
                end
              end
            else
              create_interaction_claim_publication(interaction_claim,
                                                   source_string)
            end
          end
        end
      end
    end
  end
end
