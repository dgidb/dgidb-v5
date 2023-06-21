module Genome; module Importers; module FileImporters; module HingoraniCasas;
  # https://www.science.org/doi/suppl/10.1126/scitranslmed.aag1166/suppl_file/aag1166_table_s1.zip
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'HingoraniCasas'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://stm.sciencemag.org/content/9/383/eaag1166',
          site_url: 'http://stm.sciencemag.org/content/9/383/eaag1166',
          citation: 'Finan C, Gaulton A, Kruger FA, Lumbers RT, Shah T, Engmann J, Galver L, Kelley R, Karlsson A, Santos R, Overington JP, Hingorani AD, Casas JP. The druggable genome and support for target identification and validation in drug development. Sci Transl Med. 2017 Mar 29;9(383):eaag1166. doi: 10.1126/scitranslmed.aag1166. PMID: 28356508; PMCID: PMC6321762.',
          citation_short: 'Finan C, et al. The druggable genome and support for target identification and validation in drug development. Sci Transl Med. 2017 Mar 29;9(383):eaag1166.',
          pmid: '28356508',
          pmcid: 'PMC6321762',
          doi: '10.1126/scitranslmed.aag1166',
          source_db_version: '31-May-2017',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'The druggable genome and support for target identification and validation in drug development (Hingorani & Casas, 2017)',
          license: 'Supplementary data from Author Copyright publication',
          license_link: 'https://stm.sciencemag.org/content/9/383/eaag1166/tab-pdf',
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        unless row['hgnc_names'].blank?
          gene_claim = create_gene_claim(row['hgnc_names'], GeneNomenclature::NAME)
          create_gene_claim_alias(gene_claim, row['hgnc_names'].upcase, GeneNomenclature::SYMBOL)
          create_gene_claim_alias(gene_claim, "ensembl:#{row['ensembl_gene_id'].upcase}", GeneNomenclature::NCBI_ID)
          create_gene_claim_category(gene_claim, 'DRUGGABLE GENOME')
        end
      end
    end
  end
end; end; end; end;
