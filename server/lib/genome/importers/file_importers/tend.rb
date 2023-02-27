module Genome; module Importers; module FileImporters; module Tend;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'TEND'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.uniprot.org/uniprot/',
          site_url: 'http://www.ncbi.nlm.nih.gov/pubmed/21804595/',
          citation: 'Rask-Andersen M, Almén MS, Schiöth HB. Trends in the exploitation of novel drug targets. Nat Rev Drug Discov. 2011 Aug 1;10(8):579-90. doi: 10.1038/nrd3478. PMID: 21804595.',
          citation_short: 'Rask-Andersen M, Almén MS, Schiöth HB. Trends in the exploitation of novel drug targets. Nat Rev Drug Discov. 2011 Aug 1;10(8):579-90.',
          pmid: '21804595',
          doi: '10.1038/nrd3478',
          source_db_version: '01-Aug-2011',
          source_db_name: source_db_name,
          full_name: 'Trends in the exploitation of novel drug targets (Rask-Andersen, et al., 2011)',
          license: 'Supplementary table from Macmillan Publishers Limited copyright publication',
          license_link: 'https://www.nature.com/articles/nrd3478'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t", encoding: 'iso-8859-1:utf-8') do |row|
        gene_claim = create_gene_claim("uniprot:#{row['Uniprot ID']}", GeneNomenclature::UNIPROTKB_ID)
        create_gene_claim_alias(gene_claim, row['Gene symbol'], GeneNomenclature::SYMBOL)
        create_gene_claim_alias(gene_claim, row['Uniprot accession number'], GeneNomenclature::NAME)
        create_gene_claim_attribute(gene_claim, GeneAttributeName::MAIN_CLASS, row['Target main class'])
        row['Target subclass'].split(';').each do |subclass|
          create_gene_claim_attribute(gene_claim, GeneAttributeName::SUBCLASS, subclass)
        end
        create_gene_claim_attribute(gene_claim, GeneAttributeName::HELIX_CT, row['Number of transmembrane helices'])

        drug_claim = create_drug_claim(row['Drug name'])
        row['Indication(s)'].split('; ').each do |indication|
          create_drug_claim_attribute(drug_claim, DrugAttributeName::DRUG_CLASS, indication)
        end
        create_drug_claim_attribute(drug_claim, DrugAttributeName::APPROVAL_YEAR, row['Year of approval (FDA)'])

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_link(interaction_claim, 'Trends in the exploitation of novel drug targets, Table 1', 'https://www.nature.com/articles/nrd3478/tables/1')
      end
    end
  end
end; end; end; end;
