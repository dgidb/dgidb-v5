module Genome; module Importers; module FileImporters; module FoundationOneGenes;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'FoundationOneGenes'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.foundationmedicine.com/portfolio',
          citation: 'High-throughput detection of actionable genomic alterations in clinical tumor samples by targeted, massively parallel sequencing. Wagle N, Berger MF, ..., Meyerson M, Gabriel SB, Garraway LA. Cancer Discov. 2012 Jan;2(1):82-93. PMID: 22585170',
          site_url: 'http://www.foundationone.com/',
          source_db_version: set_current_date_version,
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Foundation One',
          license: License::UNKNOWN_UNAVAILABLE,
          license_link: 'https://www.foundationmedicine.com/resource/legal-and-privacy'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['Gene'], 'Gene Symbol')
        create_gene_claim_category(gene_claim, 'CLINICALLY ACTIONABLE')
      end
    end
  end
end; end; end; end
