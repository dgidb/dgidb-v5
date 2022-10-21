module Genome; module Importers; module FileImporters; module Pharmgkb;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'PharmGKB'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.pharmgkb.org',
          site_url: 'http://www.pharmgkb.org/',
          citation: 'Whirl-Carrillo,M., McDonagh,E.M., Hebert,J.M., Gong,L., Sangkuhl,K., Thorn,C.F., Altman,R.B. and Klein,T.E. (2012) Pharmacogenomics knowledge for personalized medicine. Clin. Pharmacol. Ther., 92, 414–417. PMID: 22992668',
          source_db_version: set_current_date_version,
          source_db_name: source_db_name,
          full_name: 'PharmGKB - The Pharmacogenomics Knowledgebase',
          license_link: 'https://www.pharmgkb.org/page/dataUsagePolicy',
          license: 'Creative Commons Attribution-ShareAlike 4.0 International License'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        next if row['Association'] == 'not associated' || row['Association'] == 'ambiguous'

        if row['Entity1_type'] == 'Gene' && row['Entity2_type'] == 'Chemical'
          gene_name = row['Entity1_name']
          pharmgkb_gene_id = row['Entity1_id']
          drug_name = row['Entity2_name']
          pharmgkb_drug_id = row['Entity2_id']
          drug_claim = create_drug_claim(drug_name)
          create_drug_claim_alias(drug_claim, pharmgkb_drug_id, DrugNomenclature::PHARMGKB_ID)
          gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
          create_gene_claim_alias(gene_claim, pharmgkb_gene_id, GeneNomenclature::PHARMGKB_ID)
          interaction_claim = create_interaction_claim(gene_claim, drug_claim)
          create_interaction_claim_link(interaction_claim, 'PharmGKB interaction', "https://www.pharmgkb.org/combination/#{pharmgkb_gene_id},#{pharmgkb_drug_id}/overview")
          if row['PMIDs'].present?
            add_interaction_claim_publications(interaction_claim, row['PMIDs'])
          end
        elsif row['Entity1_type'] == 'Chemical' && row['Entity2_type'] == 'Gene'
          drug_name = row['Entity1_name']
          pharmgkb_drug_id = row['Entity1_id']
          gene_name = row['Entity2_name']
          pharmgkb_gene_id = row['Entity2_id']
          drug_claim = create_drug_claim(drug_name)
          create_drug_claim_alias(drug_claim, pharmgkb_drug_id, DrugNomenclature::PHARMGKB_ID)
          gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
          create_gene_claim_alias(gene_claim, pharmgkb_gene_id, GeneNomenclature::PHARMGKB_ID)
          interaction_claim = create_interaction_claim(gene_claim, drug_claim)
          create_interaction_claim_link(interaction_claim, 'PharmGKB interaction', "https://www.pharmgkb.org/combination/#{pharmgkb_gene_id},#{pharmgkb_drug_id}/overview")
          add_interaction_claim_publications(interaction_claim, row['PMIDs']) if row['PMIDs'].present?
        end
      end
      backfill_publication_information
    end

    def add_interaction_claim_publications(interaction_claim, source_string)
      if source_string.include?(';')
        source_string.split(';').each do |value|
          value.split(/[^\d]/).each do |pmid|
            create_interaction_claim_publication(interaction_claim, pmid) unless pmid.nil? || pmid == ''
          end
        end
      else
        create_interaction_claim_publication(interaction_claim, source_string)
      end
    end
  end
end; end; end; end;
