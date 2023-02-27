module Genome; module Importers; module FileImporters; module Cosmic
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'COSMIC'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def default_filetype
      'csv'
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://cancer.sanger.ac.uk/cosmic/drug_resistance',
          site_url: 'https://cancer.sanger.ac.uk/cosmic',
          citation: 'Tate JG, Bamford S, Jubb HC, Sondka Z, Beare DM, Bindal N, Boutselakis H, Cole CG, Creatore C, Dawson E, Fish P, Harsha B, Hathaway C, Jupe SC, Kok CY, Noble K, Ponting L, Ramshaw CC, Rye CE, Speedy HE, Stefancsik R, Thompson SL, Wang S, Ward S, Campbell PJ, Forbes SA. COSMIC: the Catalogue Of Somatic Mutations In Cancer. Nucleic Acids Res. 2019 Jan 8;47(D1):D941-D947. doi: 10.1093/nar/gky1015. PMID: 30371878; PMCID: PMC6323903.',
          citation_short: 'Tate JG, et al. COSMIC: the Catalogue Of Somatic Mutations In Cancer. Nucleic Acids Res. 2019 Jan 8;47(D1):D941-D947.',
          pmid: '30371878',
          pmcid: 'PMC6323903',
          doi: '10.1093/nar/gky1015',
          source_db_version: '4-Sep-2020',
          source_db_name: source_db_name,
          full_name: 'Catalogue Of Somatic Mutations In Cancer',
          license: 'Free for non-commercial use',
          license_link: 'https://cancer.sanger.ac.uk/cosmic/license'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: ',') do |row|
        drug_claim = create_drug_claim(row['Drug'])

        row['Genes'].split(', ').each do |gene|
          next if gene.blank?

          gene_name, _rest = gene.split('_ENST')
          gene_claim = create_gene_claim(gene_name)
          create_gene_claim_category(gene_claim, 'DRUG RESISTANCE')
          interaction_claim = create_interaction_claim(gene_claim, drug_claim)
          gene_link, _rest = gene.split('(GRC')
          gene_link = gene_link.strip
          create_interaction_claim_link(interaction_claim, "COSMIC #{gene_link} Gene Page", "https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=#{gene_link}#drug-resistance")
        end
      end
    end
  end
end; end; end; end
