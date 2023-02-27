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
          citation: 'Wagle N, Berger MF, Davis MJ, Blumenstiel B, Defelice M, Pochanard P, Ducar M, Van Hummelen P, Macconaill LE, Hahn WC, Meyerson M, Gabriel SB, Garraway LA. High-throughput detection of actionable genomic alterations in clinical tumor samples by targeted, massively parallel sequencing. Cancer Discov. 2012 Jan;2(1):82-93. doi: 10.1158/2159-8290.CD-11-0184. Epub 2011 Nov 7. PMID: 22585170; PMCID: PMC3353152.',
          citation_short: 'Wagle N, et al. High-throughput detection of actionable genomic alterations in clinical tumor samples by targeted, massively parallel sequencing. Cancer Discov. 2012 Jan;2(1):82-93.',
          site_url: 'http://www.foundationone.com/',
          pmid: '22585170',
          pmcid: 'PMC3353152',
          doi: '10.1158/2159-8290.CD-11-0184',
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
        gene_claim = create_gene_claim(row['Gene'])
        create_gene_claim_category(gene_claim, 'CLINICALLY ACTIONABLE')
      end
    end
  end
end; end; end; end
