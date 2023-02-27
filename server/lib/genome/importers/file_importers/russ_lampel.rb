module Genome; module Importers; module FileImporters; module RussLampel;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'RussLampel'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=',
          site_url: 'http://www.ncbi.nlm.nih.gov/pubmed/16376820/',
          citation: 'Russ AP, Lampel S. The druggable genome: an update. Drug Discov Today. 2005 Dec;10(23-24):1607-10. doi: 10.1016/S1359-6446(05)03666-4. PMID: 16376820.',
          citation_short: 'Russ AP, Lampel S. The druggable genome: an update. Drug Discov Today. 2005 Dec;10(23-24):1607-10.',
          pmid: '16376820',
          doi: '10.1016/S1359-6446(05)03666-4',
          source_db_version: '26-Jul-2011',
          source_db_name: source_db_name,
          full_name: 'The druggable genome: an update (Russ & Lampel, 2005)',
          license: 'Unknown; data is no longer publicly available from external site, referenced in Elsevier copyright publication',
          license_link: 'https://www.sciencedirect.com/science/article/pii/S1359644605036664'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim("ensembl:#{row['gene_stable_id']}", GeneNomenclature::ENSEMBL_ID)
        create_gene_claim_alias(gene_claim, row['display_id'], GeneNomenclature::SYMBOL) unless row['display_id'] == 'N/A'
        create_gene_claim_alias(gene_claim, row['description'], GeneNomenclature::DESCRIPTION) unless row['description'] == 'N/A'
        create_gene_claim_category(gene_claim, 'DRUGGABLE GENOME')
      end
    end
  end
end; end; end; end;
