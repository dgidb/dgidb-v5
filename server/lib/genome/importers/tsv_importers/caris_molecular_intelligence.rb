module Genome; module Importers; module TsvImporters; module CarisMolecularIntelligence
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = file_path
      @source_db_name = 'CarisMolecularIntelligence'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.carislifesciences.com/molecular-profiling-technology/',
          site_url: 'http://www.carismolecularintelligence.com/',
          citation: 'http://www.carismolecularintelligence.com/',
          source_db_version: set_current_date_version,
          source_db_name: source_db_name,
          full_name: 'Caris Molecular Intelligence',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          license: 'Unknown',
          license_link: 'https://www.carismolecularintelligence.com/contact-us/'
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
