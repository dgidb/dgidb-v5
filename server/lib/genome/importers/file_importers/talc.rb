module Genome; module Importers; module FileImporters; module Talc;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'TALC'
    end

    def create_claims
      create_interaction_claims
    end

    private
    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://www.ncbi.nlm.nih.gov/pubmed/24377743',
          site_url: 'https://www.ncbi.nlm.nih.gov/pubmed/24377743',
          citation: 'Morgensztern D, Campo MJ, Dahlberg SE, Doebele RC, Garon E, Gerber DE, Goldberg SB, Hammerman PS, Heist RS, Hensing T, Horn L, Ramalingam SS, Rudin CM, Salgia R, Sequist LV, Shaw AT, Simon GR, Somaiah N, Spigel DR, Wrangle J, Johnson D, Herbst RS, Bunn P, Govindan R. Molecularly targeted therapies in non-small-cell lung cancer annual update 2014. J Thorac Oncol. 2015 Jan;10(1 Suppl 1):S1-63. doi: 10.1097/JTO.0000000000000405. PMID: 25535693; PMCID: PMC4346098.',
          citation_short: 'Morgensztern D, et al. Molecularly targeted therapies in non-small-cell lung cancer annual update 2014. J Thorac Oncol. 2015 Jan;10(1 Suppl 1):S1-63.',
          pmid: '25535693',
          pmcid: 'PMC4346098',
          doi: '10.1097/JTO.0000000000000405',
          source_db_version: '12-May-2016',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Targeted Agents in Lung Cancer (Commentary, 2014)',
          license: 'Data extracted from tables in Elsevier copyright publication',
          license_link: 'https://www.sciencedirect.com/science/article/pii/S1525730413002350',
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['gene_target'])
        create_gene_claim_alias(gene_claim, "ncbigene:#{row['entrez_id']}", GeneNomenclature::NCBI_ID)

        drug_claim = create_drug_claim(row['drug_name'].upcase)
        unless row['drug_generic_name'] == 'NA'
          create_drug_claim_alias(drug_claim, row['drug_generic_name'], DrugNomenclature::GENERIC_NAME)
        end
        unless row['drug_trade_name'] == 'NA'
          create_drug_claim_alias(drug_claim, row['drug_trade_name'], DrugNomenclature::TRADE_NAME)
        end
        unless row['drug_synonym'] == 'NA'
          create_drug_claim_alias(drug_claim, row['drug_synonym'], DrugNomenclature::ALIAS)
        end

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_type(interaction_claim, row['interaction_type']) unless row['interaction_type'] == 'NA'
        create_interaction_claim_link(
          interaction_claim,
          source.citation,
          'https://www.sciencedirect.com/science/article/pii/S1525730413002350'
        )
      end
    end
  end
end; end; end; end;
