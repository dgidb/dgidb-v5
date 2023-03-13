module Genome; module Importers; module FileImporters; module MskImpact;
  # unclear which? I think table S11? https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5808190/
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'MskImpact'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.ncbi.nlm.nih.gov/pubmed/25801821',
          site_url: 'https://www.mskcc.org/msk-impact',
          citation: "Cheng DT, Mitchell TN, Zehir A, Shah RH, Benayed R, Syed A, Chandramohan R, Liu ZY, Won HH, Scott SN, Brannon AR, O'Reilly C, Sadowska J, Casanova J, Yannes A, Hechtman JF, Yao J, Song W, Ross DS, Oultache A, Dogan S, Borsu L, Hameed M, Nafa K, Arcila ME, Ladanyi M, Berger MF. Memorial Sloan Kettering-Integrated Mutation Profiling of Actionable Cancer Targets (MSK-IMPACT): A Hybridization Capture-Based Next-Generation Sequencing Clinical Assay for Solid Tumor Molecular Oncology. J Mol Diagn. 2015 May;17(3):251-64. doi: 10.1016/j.jmoldx.2014.12.006. Epub 2015 Mar 20. PMID: 25801821; PMCID: PMC5808190.",
          citation_short: "Cheng DT, et al. Memorial Sloan Kettering-Integrated Mutation Profiling of Actionable Cancer Targets (MSK-IMPACT): A Hybridization Capture-Based Next-Generation Sequencing Clinical Assay for Solid Tumor Molecular Oncology. J Mol Diagn. 2015 May;17(3):251-64.",
          pmid: '25801821',
          pmcid: 'PMC5808190',
          doi: '10.1016/j.jmoldx.2014.12.006',
          source_db_version: 'May-2015',
          source_db_name: source_db_name,
          full_name: 'Memorial Sloan Kettering IMPACT',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          license: 'Supplementary data from American Society for Investigative Pathology and the Association for Molecular Pathology copyright publication',
          license_link: 'https://jmd.amjpathol.org/action/showPdf?pii=S1525-1578%2815%2900045-8'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true) do |row|
        gene_claim = create_gene_claim(row['gene_symbol'])
        create_gene_claim_category(gene_claim, 'CLINICALLY ACTIONABLE')
      end
    end
  end
end; end; end; end;
