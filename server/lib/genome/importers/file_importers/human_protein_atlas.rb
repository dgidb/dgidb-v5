module Genome; module Importers; module FileImporters; module HumanProteinAtlas;
  # https://www.proteinatlas.org/search/protein_class%3APotential+drug+targets?format=tsv
  class Importer < Genome::Importers::Base
    attr_reader :file_path, :categories

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'HumanProteinAtlas'
    end

    def create_claims
      create_gene_claims
    end

    private
    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.proteinatlas.org/search/protein_class%3APotential+drug+targets',
          site_url: 'https://www.proteinatlas.org/',
          citation: 'Uhlén M, Fagerberg L, Hallström BM, Lindskog C, Oksvold P, Mardinoglu A, Sivertsson Å, Kampf C, Sjöstedt E, Asplund A, Olsson I, Edlund K, Lundberg E, Navani S, Szigyarto CA, Odeberg J, Djureinovic D, Takanen JO, Hober S, Alm T, Edqvist PH, Berling H, Tegel H, Mulder J, Rockberg J, Nilsson P, Schwenk JM, Hamsten M, von Feilitzen K, Forsberg M, Persson L, Johansson F, Zwahlen M, von Heijne G, Nielsen J, Pontén F. Proteomics. Tissue-based map of the human proteome. Science. 2015 Jan 23;347(6220):1260419. doi: 10.1126/science.1260419. PMID: 25613900.',
          citation_short: 'Uhlén M, et al. Proteomics. Tissue-based map of the human proteome. Science. 2015 Jan 23;347(6220):1260419.',
          pmid: '25613900',
          doi: '10.1126/science.1260419',
          source_db_version: '19.3',
          source_db_name: source_db_name,
          full_name: 'The Human Protein Atlas',
          license: License::CC_BY_SA_3_0,
          license_link: 'https://www.proteinatlas.org/about/licence'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['Gene'])
        create_gene_claim_alias(gene_claim, "ensembl:#{row['Ensembl']}", GeneNomenclature::ENSEMBL_ID)
        unless row['Gene synonym'].nil?
          row['Gene synonym'].split(', ').each do |s|
            create_gene_claim_alias(gene_claim, s, GeneNomenclature::SYNONYM)
          end
        end
        create_gene_claim_alias(gene_claim, row['Gene description'], GeneNomenclature::DESCRIPTION)
        create_gene_claim_alias(gene_claim, "uniprot:#{row['Uniprot']}", GeneNomenclature::UNIPROTKB_ID)

        row['Protein class'].split(', ').each do |c|
          create_gene_claim_category(gene_claim, categories[c]) if categories.key? c
        end
      end
    end

    def categories
      @categories ||= {
        'Enzymes' => 'ENZYME',
        'Transporters' => 'TRANSPORTER',
        'G-protein coupled receptors' => 'G PROTEIN COUPLED RECEPTOR',
        'CD markers' => 'CELL SURFACE',
        'Voltage-gated ion channels' => 'ION CHANNEL',
        'Nuclear receptors' => 'NUCLEAR HORMONE RECEPTOR',
      }
    end
  end
end; end; end; end;
