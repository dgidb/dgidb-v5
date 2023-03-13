module Genome; module Importers; module FileImporters; module BaderLab;
  # http://baderlab.org/Data/RoadsNotTaken?action=AttachFile&do=get&target=NuclearHormoneReceptors.xlsx
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'BaderLab'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://baderlab.org/Data/RoadsNotTaken',
          citation: 'Edwards AM, Isserlin R, Bader GD, Frye SV, Willson TM, Yu FH. Too many roads not taken. Nature. 2011 Feb 10;470(7333):163-5. doi: 10.1038/470163a. PMID: 21307913.',
          citation_short: 'Edwards AM, et al. Too many roads not taken. Nature. 2011 Feb 10;470(7333):163-5.',
          pmid: '21307913',
          doi: '10.1038/470163a',
          site_url: 'http://baderlab.org/Data/RoadsNotTaken',
          source_db_version: 'February 2014',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Bader Lab Genes',
          license: 'Supplemental data from CC-BY 3.0 arXiv preprint',
          license_link: 'http://baderlab.org/Data/RoadsNotTaken'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['Primary Name'], GeneNomenclature::NCBI_NAME)
        create_gene_claim_attribute(gene_claim, GeneAttributeName::QUERY, row['Initial Gene Query'])
        create_gene_claim_attribute(gene_claim, GeneAttributeName::CITES, row['1950-2009'])
        create_gene_claim_category(gene_claim, 'NUCLEAR HORMONE RECEPTOR')
      end
    end
  end
end; end; end; end
