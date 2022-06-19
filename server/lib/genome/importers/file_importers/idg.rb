module Genome; module Importers; module FileImporters; module Idg;
  # https://github.com/druggablegenome/IDGTargets
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'IDG'
    end

    def create_claims
      create_gene_claims
    end

    private

    def default_filetype
      'json'
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://druggablegenome.net/IDGProteinList/',
          site_url: 'https://druggablegenome.net/',
          citation: 'Rodgers,G., Austin,C., Anderson,J., Pawlyk,A., Colvis,C., Margolis,R. and Baker,J. (2018) Glimmers in illuminating the druggable genome. Nat. Rev. Drug Discov., 17, 301–302. PMID: 29348682',
          source_db_version: '15-July-2019',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Illuminating the Druggable Genome',
          license: 'Creative Commons Attribution-ShareAlike 4.0 International License',
          license_link: 'https://druggablegenome.net/IDGPolicies#Policy3'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      file = File.read(file_path)
      JSON.parse(file).each do |record|
        gene_claim = create_gene_claim(record['Gene'], 'Gene Symbol')
        family_type = record['IDGFamily']
        case family_type
        when 'GPCR'
          create_gene_claim_category(gene_claim, 'G PROTEIN COUPLED RECEPTOR')
        when 'IonChannel'
          create_gene_claim_category(gene_claim, 'ION CHANNEL')
        else
          create_gene_claim_category(gene_claim, family_type.upcase)
        end
      end
    end
  end
end; end; end; end;
