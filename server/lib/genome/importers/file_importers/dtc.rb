module Genome; module Importers; module FileImporters; module Dtc;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'DTC'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def default_filetype
      'csv'
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://drugtargetcommons.fimm.fi/',
          site_url: 'https://drugtargetcommons.fimm.fi/',
          citation: 'Tanoli Z, Alam Z, Vähä-Koskela M, Ravikumar B, Malyutina A, Jaiswal A, Tang J, Wennerberg K, Aittokallio T. Drug Target Commons 2.0: a community platform for systematic analysis of drug-target interaction profiles. Database (Oxford). 2018 Jan 1;2018:1-13. doi: 10.1093/database/bay083. PMID: 30219839; PMCID: PMC6146131.',
          citation_short: 'Tanoli Z, et al. Drug Target Commons 2.0: a community platform for systematic analysis of drug-target interaction profiles. Database (Oxford). 2018 Jan 1;2018:1-13.',
          pmid: '30219839',
          pmcid: 'PMC6146131',
          doi: '10.1093/database/bay083',
          source_db_version: '2020-09-02',  # using static file
          source_db_name: source_db_name,
          full_name: 'Drug Target Commons',
          license: License::CC_BY_NC_SA_3_0,
          license_link: 'https://academic.oup.com/database/article/doi/10.1093/database/bay083/5096727#129405854'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true) do |row|
        drug_id = row['compound_id']
        drug_name = row['compound_name']
        gene_name = row['gene_names']
        pmid = row['pubmed_id']
        mechanism = row['ep_action_mode']
        unless drug_name.nil? || gene_name.nil?
          drug_claim = create_drug_claim(drug_name)
          unless drug_id.nil?
            create_drug_claim_alias(drug_claim, "chembl:#{drug_id}", DrugNomenclature::CHEMBL_ID)
          end
          gene_name.split(',').each do |indv_gene|
            gene_claim = create_gene_claim(indv_gene, GeneNomenclature::NAME)
            interaction_claim = create_interaction_claim(gene_claim, drug_claim)
            unless pmid.nil? || pmid == '' || pmid == '""' || pmid == "''" || pmid[0] == '-' || pmid == '15288657'
              create_interaction_claim_publication(interaction_claim, pmid)
            end
            unless mechanism.nil? || mechanism == ''
              create_interaction_claim_type(interaction_claim, mechanism)
            end
            create_interaction_claim_link(interaction_claim, 'Drug Target Commons Interactions', 'https://drugtargetcommons.fimm.fi/')
          end
        end
      end
      backfill_publication_information
    end
  end
end; end; end; end;
