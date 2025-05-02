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

    def handle_file_location(file_path)
      return file_path unless file_path.nil?

      directory = "#{default_data_dir}/pharmgkb/"
      Dir.glob(File.join(directory, 'pharmgkb_*.tsv')).max_by { |file| file.match(/pharmgkb_(\d+)\.db/)[1].to_i rescue 0 }
    end


    def get_version
      match = @file_path.match(/(\d{8})/)
      match ? match[1] : nil
    end


    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.pharmgkb.org',
          site_url: 'http://www.pharmgkb.org/',
          citation: 'Whirl-Carrillo M, Huddart R, Gong L, Sangkuhl K, Thorn CF, Whaley R, Klein TE. An Evidence-Based Framework for Evaluating Pharmacogenomics Knowledge for Personalized Medicine. Clin Pharmacol Ther. 2021 Sep;110(3):563-572. doi: 10.1002/cpt.2350. Epub 2021 Jul 22. PMID: 34216021; PMCID: PMC8457105.',
          citation_short: 'Whirl-Carrillo M, et al. An Evidence-Based Framework for Evaluating Pharmacogenomics Knowledge for Personalized Medicine. Clin Pharmacol Ther. 2021 Sep;110(3):563-572.',
          pmid: '34216021',
          pmcid: 'PMC8457105',
          doi: '10.1002/cpt.2350',
          source_db_version: get_version,
          source_db_name: source_db_name,
          full_name: 'PharmGKB - The Pharmacogenomics Knowledgebase',
          license: License::CC_BY_SA_4_0,
          license_link: 'https://www.pharmgkb.org/page/dataUsagePolicy',
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
          create_drug_claim_alias(drug_claim, "pharmgkb.drug:#{pharmgkb_drug_id}", DrugNomenclature::PHARMGKB_ID)
          gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
          create_gene_claim_alias(gene_claim, "pharmgkb.gene:#{pharmgkb_gene_id}", GeneNomenclature::PHARMGKB_ID)
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
          create_drug_claim_alias(drug_claim, "pharmgkb.drug:#{pharmgkb_drug_id}", DrugNomenclature::PHARMGKB_ID)
          gene_claim = create_gene_claim(gene_name, GeneNomenclature::NAME)
          create_gene_claim_alias(gene_claim, "pharmgkb.gene:#{pharmgkb_gene_id}", GeneNomenclature::PHARMGKB_ID)
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
