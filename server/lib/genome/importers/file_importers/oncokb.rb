module Genome; module Importers; module FileImporters; module Oncokb;
  class Importer < Genome::Importers::Base
    def initialize(tsv_root_path)
      if tsv_root_path.nil?
        @tsv_root = 'lib/data/oncokb/'
      else
        @tsv_root = tsv_root_path
      end
      @source_db_name = 'OncoKB'
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
        base_url: 'https://www.oncokb.org',
        citation: 'OncoKB: A Precision Oncology Knowledge Base. Chakravarty D, Gao J, Phillips S, et. al. JCO Precision Oncology 2017 :1, 1-16. PMID: 28890946',
        site_url: 'http://www.oncokb.org/',
        source_db_name: source_db_name,
        source_db_version: '23-July-2020',
        source_trust_level_id: SourceTrustLevel.NON_CURATED,
        full_name: 'OncoKB: A Precision Oncology Knowledge Base',
        license: 'Restrictive, non-commercial',
        license_link: 'https://www.oncokb.org/terms'
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_drug_claims
      CSV.foreach("#{@tsv_root}drug_claim.csv", headers: false, col_sep: ',') do |row|
        dc = create_drug_claim(row[0])
        @drug_claims[row[0]] = dc
      end
    end

    def create_gene_claims
      CSV.foreach("#{@tsv_root}gene_claim.csv", headers: false, col_sep: ',') do |row|
        next if row[0] == 'Other Biomarkers'

        gc = create_gene_claim(row[0], row[1])
        @gene_claims[row[0]] = gc
      end
      CSV.foreach("#{@tsv_root}gene_claim_aliases.csv", headers: false, col_sep: ',') do |row|
        gc = @gene_claims[row[0]]
        next if gc.nil?

        case row[2]
        when 'OncoKB Entrez Id'
          create_gene_claim_alias(gc, "ncbigene:#{row[1]}", GeneNomenclature::NCBI_ID)
        end
      end
    end

    def create_interaction_claims
      CSV.foreach("#{@tsv_root}interaction_claim.csv", headers: false, col_sep: ',') do |row|
        gc = @gene_claims[row[1]]
        dc = @drug_claims[row[0]]
        next if gc.nil? || dc.nil?

        ic = create_interaction_claim(gc, dc)
        @interaction_claims[[gc, dc]] = ic

      end
      CSV.foreach("#{@tsv_root}interaction_claim_attributes.csv", headers: false, col_sep: ',') do |row|
        gc = @gene_claims[row[3]]
        dc = @drug_claims[row[2]]
        next if gc.nil? || dc.nil?

        ic = @interaction_claims[[gc, dc]]

        ica_name = row[0]
        ica_name = InteractionAttributeName::COMBINATION if ica_name = 'combination therapy'
        create_interaction_claim_attribute(ic, ica_name, row[1])
      end
      CSV.foreach("#{@tsv_root}interaction_claim_links.csv", headers: false, col_sep: ',') do |row|
        gc = @gene_claims[row[3]]
        dc = @drug_claims[row[2]]
        next if gc.nil? || dc.nil?

        ic = @interaction_claims[[gc, dc]]
        create_interaction_claim_link(ic, row[0], row[1])
      end
    end
  end
end; end; end; end;
