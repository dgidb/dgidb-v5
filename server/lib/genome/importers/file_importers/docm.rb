module Genome
  module Importers
    module FileImporters
      module Docm
        class Importer < Genome::Importers::Base
          attr_reader :file_path

          def initialize(tsv_root_path)
            @tsv_root = if tsv_root_path.nil?
                          "#{default_data_dir}/docm/"
                        else
                          tsv_root_path
                        end
            @source_db_name = 'DoCM'
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
                base_url: 'http://docm.info/',
                site_url: 'http://docm.info/',
                citation: 'Ainscough BJ, Griffith M, Coffman AC, Wagner AH, Kunisaki J, Choudhary MN, McMichael JF, Fulton RS, Wilson RK, Griffith OL, Mardis ER. DoCM: a database of curated mutations in cancer. Nat Methods. 2016 Sep 29;13(10):806-7. doi: 10.1038/nmeth.4000. PMID: 27684579; PMCID: PMC5317181.',
                citation_short: 'Ainscough BJ, et al. DoCM: a database of curated mutations in cancer. Nat Methods. 2016 Sep 29;13(10):806-7.',
                pmid: '27684579',
                pmcid: 'PMC5317181',
                doi: '10.1038/nmeth.4000',
                source_db_version: '2024-10-02',
                source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
                source_db_name:,
                full_name: 'Database of Curated Mutations',
                license: License::CC_BY_4_0,
                license_link: 'https://github.com/griffithlab/docm/blob/c8d2a8723f505689074d07841931475b9b7e914c/app/views/static/about.html.haml#L86'
              }
            )
            @source.source_types << SourceType.find_by(type: 'interaction')
            @source.save
          end


          def create_drug_claims
            CSV.foreach("#{@tsv_root}docm_drug_claims.csv", headers: true, col_sep: ',') do |row|
              dc = create_drug_claim(row[0])
              @drug_claims[row[0]] = dc
            end
          end

          def create_gene_claims
            CSV.foreach("#{@tsv_root}docm_gene_claims.csv", headers: true, col_sep: ',') do |row|
              gc = create_gene_claim(row[0], GeneNomenclature::NCBI_NAME)
              @gene_claims[row[0]] = gc
            end
          end

          def create_interaction_claims
            CSV.foreach("#{@tsv_root}docm_interaction_claims.csv", headers: true, col_sep: ',') do |row|
              gc = @gene_claims[row[1]]
              dc = @drug_claims[row[0]]
              next if gc.nil? || dc.nil?

              ic = create_interaction_claim(gc, dc)
              @interaction_claims[[gc, dc]] = ic
            end
            CSV.foreach("#{@tsv_root}docm_interaction_claim_attributes.csv", headers: true, col_sep: ',') do |row|
              gc = @gene_claims[row[3]]
              dc = @drug_claims[row[2]]
              next if gc.nil? || dc.nil?

              ic = @interaction_claims[[gc, dc]]
              create_interaction_claim_attribute(ic, row[0], row[1])
            end
            CSV.foreach("#{@tsv_root}docm_interaction_claim_publications.csv", headers: true, col_sep: ',') do |row|
              gc = @gene_claims[row[3]]
              dc = @drug_claims[row[2]]
              next if gc.nil? || dc.nil?

              ic = @interaction_claims[[gc, dc]]
              create_interaction_claim_publication(ic, row[0])
            end
          end
        end
      end
    end
  end
end
