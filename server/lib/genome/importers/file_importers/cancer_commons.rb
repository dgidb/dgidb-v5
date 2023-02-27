module Genome; module Importers; module FileImporters; module CancerCommons;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'CancerCommons'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.cancercommons.org/researchers-clinicians/',
          site_url: 'http://www.cancercommons.org/',
          citation: 'Shrager J, Tenenbaum JM, Travers M: Cancer Commons: Biomedicine in the internet age. In Ekins/- Collaborative Computational Technologies for Biomedical Research.Wiley-Blackwell;2011;161–177.',
          citation_short: 'Shrager J, et al. In Ekins/- Collaborative Computational Technologies for Biomedical Research.Wiley-Blackwell;2011;161–177.',
          doi: '10.1002/9781118026038.ch11',
          source_db_version: '25-Jul-2013',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Cancer Commons',
          license: 'Custom non-commercial',
          license_link: 'https://www.cancercommons.org/terms-of-use/'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, encoding: 'iso-8859-1:utf-8', headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['primary_gene_name'].upcase)
        create_gene_claim_alias(gene_claim, "ncbigene:#{row['entrez_gene_id']}", GeneNomenclature::NCBI_ID)
        create_gene_claim_alias(gene_claim,  row['reported_gene_name'], GeneNomenclature::NAME)

        drug_claim = create_drug_claim(row['primary_drug_name'].strip.upcase, DrugNomenclature::PRIMARY_NAME)
        create_drug_claim_attribute(drug_claim, DrugAttributeName::DRUG_CLASS, row['drug_class'])
        create_drug_claim_attribute(drug_claim, DrugAttributeName::DEVELOPER, row['pharmaceutical_developer'])

        row['source_reported_drug_name'].split('/').map { |drug_name|
          create_drug_claim_alias(drug_claim, drug_name, DrugNomenclature::ALIAS)
        }
        unless row['pubchem_drug_name'].upcase == 'NA'
          create_drug_claim_alias(drug_claim, row['pubchem_drug_name'], DrugNomenclature::ALIAS)
        end
        unless row['pubchem_drug_id'].upcase == 'NA'
          create_drug_claim_alias(drug_claim, "pubchem.compound:#{row['pubchem_drug_id']}",
                                  DrugNomenclature::PUBCHEM_COMPOUND_ID)
        end
        create_drug_claim_alias(drug_claim, row['drug_trade_name'], DrugNomenclature::TRADE_NAME)
        create_drug_claim_alias(drug_claim, row['drug_development_name'], DrugNomenclature::DEVELOPMENT_NAME)

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_type(interaction_claim, row['interaction_type'])
        create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::CANCER_TYPE, row['cancer_type'])
        create_interaction_claim_link(
          interaction_claim,
          'Source TSV',
          File.join('data', 'source_tsvs', 'CancerCommons_INTERACTIONS.tsv')
        )
      end
    end
  end
end; end; end; end;
