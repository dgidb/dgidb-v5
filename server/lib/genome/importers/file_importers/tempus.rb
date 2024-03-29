module Genome; module Importers; module FileImporters; module Tempus
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'Tempus'
    end

    def create_claims
      create_gene_claims
    end

    private
    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.tempus.com/clinical-validation-of-the-tempus-xt-next-generation-targeted-oncology-sequencing-assay/',
          site_url: 'https://www.tempus.com/',
          citation: 'Beaubier N, Tell R, Lau D, Parsons JR, Bush S, Perera J, Sorrells S, Baker T, Chang A, Michuda J, Iguartua C, MacNeil S, Shah K, Ellis P, Yeatts K, Mahon B, Taxter T, Bontrager M, Khan A, Huether R, Lefkofsky E, White KP. Clinical validation of the tempus xT next-generation targeted oncology sequencing assay. Oncotarget. 2019 Mar 22;10(24):2384-2396. doi: 10.18632/oncotarget.26797. PMID: 31040929; PMCID: PMC6481324.',
          citation_short: 'Beaubier N, et al. Clinical validation of the tempus xT next-generation targeted oncology sequencing assay. Oncotarget. 2019 Mar 22;10(24):2384-2396.',
          pmid: '31040929',
          pmcid: 'PMC6481324',
          doi: '10.18632/oncotarget.26797',
          source_db_version: '11-November-2018',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Tempus xT',
          license: 'Supplementary data from CC-BY 3.0 Beaubier et al. copyright publication',
          license_link: 'https://www.oncotarget.com/article/26797/text/'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true) do |row|
        gene_claim = create_gene_claim(row['Gene'])
        create_gene_claim_category(gene_claim, 'CLINICALLY ACTIONABLE')
      end
    end
  end
end; end; end; end
