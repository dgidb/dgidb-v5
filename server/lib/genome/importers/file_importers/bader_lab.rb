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
          citation: 'Too many roads not taken: Aled M. Edwards, Ruth Isserlin, Gary D. Bader, Stephen V. Frye, Timothy M. Willson & Frank H. Yu Nature 470, 163-165 (10 February 2011) doi:10.1038/470163a',
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
        gene_claim = create_gene_claim(row['Primary Name'], 'Entrez Gene Name')
        create_gene_claim_attribute(gene_claim, 'Initial Gene Query', row['Initial Gene Query'])
        create_gene_claim_attribute(gene_claim, 'Counted Citations from 1950-2009', row['1950-2009'])
        create_gene_claim_category(gene_claim, 'NUCLEAR HORMONE RECEPTOR')
      end
    end
  end
end; end; end; end
