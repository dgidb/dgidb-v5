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
          citation: 'Rodgers G, Austin C, Anderson J, Pawlyk A, Colvis C, Margolis R, Baker J. Glimmers in illuminating the druggable genome. Nat Rev Drug Discov. 2018 May;17(5):301-302. doi: 10.1038/nrd.2017.252. Epub 2018 Jan 19. PMID: 29348682; PMCID: PMC6309548.',
          citation_short: 'Rodgers G, et al. Glimmers in illuminating the druggable genome. Nat Rev Drug Discov. 2018 May;17(5):301-302.',
          pmid: '29348682',
          pmcid: 'PMC6309548',
          doi: '10.1038/nrd.2017.252',
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
        gene_claim = create_gene_claim(record['Gene'])
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
