module Genome
  module Importers
    module FileImporters
      module CkbCore
        class Importer < Genome::Importers::Base
          def initialize(tsv_root_path)
            @tsv_root = if tsv_root_path.nil?
                          "#{default_data_dir}/ckb_core/"
                        else
                          tsv_root_path
                        end
            @source_db_name = 'CKB-CORE'
            @drug_claims = {}
            @gene_claims = {}
            @interaction_claims = {}
          end

          def create_claims
            create_drug_claims
            create_gene_claims
            create_interaction_claims
          end

          private

          def create_new_source
            @source ||= Source.create(
              {
                source_db_name: source_db_name,
                source_db_version: '2024-11-27',
                base_url: 'https://ckb-core.genomenon.com/gene/show?geneId=',
                site_url: 'https://ckb-core.genomenon.com',
                citation: 'Patterson SE, Liu R, Statz CM, Durkin D, Lakshminarayana A, Mockus SM. The clinical trial landscape in oncology and connectivity of somatic mutational profiles to targeted therapies. Hum Genomics. 2016 Jan 16;10:4. doi: 10.1186/s40246-016-0061-7. PMID: 26772741; PMCID: PMC4715272.',
                citation_short: 'Patterson SE, et al. The clinical trial landscape in oncology and connectivity of somatic mutational profiles to targeted therapies. Hum Genomics. 2016 Jan 16;10:4.',
                pmid: '26772741',
                pmcid: 'PMC4715272',
                doi: '10.1186/s40246-016-0061-7',
                full_name: 'The Cancer Knowledgebase',
                license: License::CC_BY_NC_SA_4_0,
                license_link: 'https://ckb.genomenon.org/about/index'
              }
            )
            @source.source_types << SourceType.find_by(type: 'interaction')
            @source.save
          end

          def create_drug_claims
            CSV.foreach("#{@tsv_root}ckb_core_drug_claims.csv",
                        headers: false, col_sep: ',') do |row|
              dc = create_drug_claim(row[0])
              @drug_claims[row[0]] = dc
            end
          end

          def create_gene_claims
            CSV.foreach("#{@tsv_root}ckb_core_gene_claims.csv",
                        headers: false, col_sep: ',') do |row|
              gc = create_gene_claim(row[0], row[1])
              @gene_claims[row[0]] = gc
            end
            CSV.foreach("#{@tsv_root}ckb_core_gene_claim_aliases.csv",
                        headers: false, col_sep: ',') do |row|
              gc = @gene_claims[row[0]]
              next if gc.nil?

              create_gene_claim_alias(gc, row[1], row[2])
            end
          end

          def create_interaction_claims
            CSV.foreach("#{@tsv_root}ckb_core_interaction_claims.csv",
                        headers: false, col_sep: ',') do |row|
              gc = @gene_claims[row[1]]
              dc = @drug_claims[row[0]]
              next if gc.nil? || dc.nil?

              ic = create_interaction_claim(gc, dc)
              @interaction_claims[[gc, dc]] = ic
            end
            CSV.foreach(
              "#{@tsv_root}ckb_core_interaction_claim_attributes.csv", headers: false, col_sep: ','
            ) do |row|
              gc = @gene_claims[row[3]]
              dc = @drug_claims[row[2]]
              next if gc.nil? || dc.nil?

              ic = @interaction_claims[[gc, dc]]

              create_interaction_claim_attribute(ic, row[0], row[1])
            end
            CSV.foreach(
              "#{@tsv_root}ckb_core_interaction_claim_links.csv", headers: false, col_sep: ','
            ) do |row|
              gc = @gene_claims[row[3]]
              dc = @drug_claims[row[2]]
              next if gc.nil? || dc.nil?

              ic = @interaction_claims[[gc, dc]]
              create_interaction_claim_link(ic, row[0], row[1])
            end
            CSV.foreach(
              "#{@tsv_root}ckb_core_interaction_claim_publications.csv", headers: false, col_sep: ','
            ) do |row|
              gc = @gene_claims[row[3]]
              dc = @drug_claims[row[2]]
              next if gc.nil? || dc.nil?

              ic = @interaction_claims[[gc, dc]]
              create_interaction_claim_publication(ic, row[0])
            end
          end
        end
      end; end; end; end
