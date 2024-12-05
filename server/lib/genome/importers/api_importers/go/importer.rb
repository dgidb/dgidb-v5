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
          citation: "Gene Ontology Consortium; Aleksander SA, Balhoff J, Carbon S, Cherry JM, Drabkin HJ, Ebert D, Feuermann M, Gaudet P, Harris NL, Hill DP, Lee R, Mi H, Moxon S, Mungall CJ, Muruganugan A, Mushayahama T, Sternberg PW, Thomas PD, Van Auken K, Ramsey J, Siegele DA, Chisholm RL, Fey P, Aspromonte MC, Nugnes MV, Quaglia F, Tosatto S, Giglio M, Nadendla S, Antonazzo G, Attrill H, Dos Santos G, Marygold S, Strelets V, Tabone CJ, Thurmond J, Zhou P, Ahmed SH, Asanitthong P, Luna Buitrago D, Erdol MN, Gage MC, Ali Kadhum M, Li KYC, Long M, Michalak A, Pesala A, Pritazahra A, Saverimuttu SCC, Su R, Thurlow KE, Lovering RC, Logie C, Oliferenko S, Blake J, Christie K, Corbani L, Dolan ME, Drabkin HJ, Hill DP, Ni L, Sitnikov D, Smith C, Cuzick A, Seager J, Cooper L, Elser J, Jaiswal P, Gupta P, Jaiswal P, Naithani S, Lera-Ramirez M, Rutherford K, Wood V, De Pons JL, Dwinell MR, Hayman GT, Kaldunski ML, Kwitek AE, Laulederkind SJF, Tutaj MA, Vedi M, Wang SJ, D'Eustachio P, Aimo L, Axelsen K, Bridge A, Hyka-Nouspikel N, Morgat A, Aleksander SA, Cherry JM, Engel SR, Karra K, Miyasato SR, Nash RS, Skrzypek MS, Weng S, Wong ED, Bakker E, Berardini TZ, Reiser L, Auchincloss A, Axelsen K, Argoud-Puy G, Blatter MC, Boutet E, Breuza L, Bridge A, Casals-Casas C, Coudert E, Estreicher A, Livia Famiglietti M, Feuermann M, Gos A, Gruaz-Gumowski N, Hulo C, Hyka-Nouspikel N, Jungo F, Le Mercier P, Lieberherr D, Masson P, Morgat A, Pedruzzi I, Pourcel L, Poux S, Rivoire C, Sundaram S, Bateman A, Bowler-Barnett E, Bye-A-Jee H, Denny P, Ignatchenko A, Ishtiaq R, Lock A, Lussi Y, Magrane M, Martin MJ, Orchard S, Raposo P, Speretta E, Tyagi N, Warner K, Zaru R, Diehl AD, Lee R, Chan J, Diamantakis S, Raciti D, Zarowiecki M, Fisher M, James-Zorn C, Ponferrada V, Zorn A, Ramachandran S, Ruzicka L, Westerfield M. The Gene Ontology knowledgebase in 2023. Genetics. 2023 May 4;224(1):iyad031. doi: 10.1093/genetics/iyad031. PMID: 36866529; PMCID: PMC10158837.",
          citation_short: 'Gene Ontology Consortium. The Gene Ontology knowledgebase in 2023. Genetics. 2023 May 4;224(1):iyad031.',
          pmid: '36866529',
          pmcid: 'PMC10158837',
          doi: '10.1093/genetics/iyad031',
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
          begin
            genes = api_client.genes_for_go_id(go_id, start, rows)
          rescue PagesExhaustedError => e
            break  # inferring that a 404 indicates exhaustion of page queue
          end
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
