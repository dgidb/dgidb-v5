module Genome; module Importers; module ApiImporters; module Pharos;
  class Importer < Genome::Importers::Base
    attr_reader :new_version

    def initialize
      @source_db_name = 'Pharos'
    end

    def create_claims
      create_gene_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://pharos-api.ncats.io/graphql',
          site_url: 'https://pharos.nih.gov/',
          citation: 'Nguyen, D.-T., Mathias, S. et al, "Pharos: Collating Protein Information to Shed Light on the Druggable Genome", Nucl. Acids Res.i>, 2017, 45(D1), D995-D1002. DOI: 10.1093/nar/gkw1072. PMID: 27903890',
          source_db_version: set_current_date_version,
          source_db_name: source_db_name,
          full_name: 'Pharos',
          license: 'Creative Commons Attribution-ShareAlike 4.0 International License',
          license_link: 'https://pharos.nih.gov/about',
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def categories
      ['Enzyme', 'Transcription Factor', 'Kinase', 'Transporter', 'GPCR', 'Ion Channel', 'Nuclear Receptor']
    end

    def create_gene_claims
      api_client = ApiClient.new
      categories.each do |category|
        api_client.enumerate_genes(category).each do |gene|
          next if gene.sym.nil?

          gene_claim = create_gene_claim(gene.sym, GeneNomenclature::SYMBOL)
          create_gene_claim_alias(gene_claim, gene.name, GeneNomenclature::NAME)
          create_gene_claim_alias(gene_claim, "uniprot:#{gene.uniprot}", GeneNomenclature::UNIPROTKB_ID)
          normalized_category = case category
                                when 'GPCR'
                                  'G PROTEIN COUPLED RECEPTOR'
                                when 'Nuclear Receptor'
                                  'NUCLEAR HORMONE RECEPTOR'
                                else
                                  category.upcase
                                end
          create_gene_claim_category(gene_claim, normalized_category)
        end
      end
    end
  end
end; end; end; end
