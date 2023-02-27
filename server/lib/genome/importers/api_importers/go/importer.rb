module Genome; module Importers; module ApiImporters; module Go;
  class Importer < Genome::Importers::Base
    attr_reader :new_version

    def initialize
      @source_db_name = 'GO'
    end

    def create_claims
      create_gene_claims
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://amigo.geneontology.org/amigo/gene_product/UniProtKB:',
          site_url: 'http://www.geneontology.org/',
          citation: 'Gene Ontology Consortium. The Gene Ontology resource: enriching a GOld mine. Nucleic Acids Res. 2021 Jan 8;49(D1):D325-D334. doi: 10.1093/nar/gkaa1113. PMID: 33290552; PMCID: PMC7779012.',
          citation_short: 'Gene Ontology Consortium. The Gene Ontology resource: enriching a GOld mine. Nucleic Acids Res. 2021 Jan 8;49(D1):D325-D334.',
          pmid: '33290552',
          pmcid: 'PMC7779012',
          doi: '10.1093/nar/gkaa1113',
          source_db_version: set_current_date_version,
          source_db_name: source_db_name,
          full_name: 'The Gene Ontology',
          license: License::CC_ATT_4_0,
          license_link: 'http://geneontology.org/docs/go-citation-policy/'
        }
      )
      @source.source_types << SourceType.find_by(type: 'potentially_druggable')
      @source.save
    end

    def create_gene_claims
      api_client = ApiClient.new
      categories.each do |category, go_id|
        start = 0
        rows = 500
        genes = api_client.genes_for_go_id(go_id, start, rows)
        while genes.count.positive? do
          genes.each do |gene|
            create_gene_claim_for_entry(gene, category) if gene['taxon_label'] == 'Homo sapiens'
          end
          start += rows
          genes = api_client.genes_for_go_id(go_id, start, rows)
        end
      end
    end

    def create_gene_claim_for_entry(gene, category)
      return if gene['bioentity_label'].strip == ''

      gene_claim = create_gene_claim(gene['bioentity_label'])
      unless gene['bioentity_name'].include? 'Uncharacterized'
        create_gene_claim_alias(gene_claim, gene['bioentity_name'], GeneNomenclature::NAME)
      end

      unless gene['synonym'].nil?
        gene['synonym'].each do |synonym|
          if synonym.include? 'UniProtKB:'
            create_gene_claim_alias(gene_claim, synonym.gsub('UniProtKB:', 'uniprot'), GeneNomenclature::UNIPROTKB_ID)
          else
            create_gene_claim_alias(gene_claim, synonym, GeneNomenclature::SYNONYM)
          end
        end
      end

      create_gene_claim_category(gene_claim, category)
    end

    def categories
      {
        'KINASE' => '0016301',
        'TYROSINE KINASE' => '0004713',
        'SERINE THREONINE KINASE' => '0004674',
        'PROTEIN PHOSPHATASE' => '0004721',
        'G PROTEIN COUPLED RECEPTOR' => '0004930',
        'NEUTRAL ZINC METALLOPEPTIDASE' => '0008237',
        'ABC TRANSPORTER' => '0042626',
        'RNA DIRECTED DNA POLYMERASE' => '0003964',
        'TRANSPORTER' => '0005215',
        'ION CHANNEL' => '0005216',
        'NUCLEAR HORMONE RECEPTOR' => '0004879',
        'LIPID KINASE' => '0001727',
        'PHOSPHOLIPASE' => '0004620',
        'PROTEASE INHIBITOR' => '0030414',
        'DNA REPAIR' => '0006281',
        'CELL SURFACE' => '0009986',
        'EXTERNAL SIDE OF PLASMA MEMBRANE' => '0009897',
        'GROWTH FACTOR' => '0008083',
        'HORMONE ACTIVITY' => '0005179',
        'TUMOR SUPPRESSOR' => '0051726',
        'TRANSCRIPTION FACTOR BINDING' => '0008134',
        'TRANSCRIPTION FACTOR COMPLEX' => '0005667',
        'HISTONE MODIFICATION' => '0016570',
        'DRUG METABOLISM' => '0017144',
        'DRUG RESISTANCE' => '0042493',
        'PROTEASE' => '0008233',
      }
    end
  end
end; end; end; end
