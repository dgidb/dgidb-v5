module Genome; module Importers; module FileImporters; module ClearityFoundationBiomarkers;
  class Importer < Genome::Importers::Base
    attr_reader :file_path

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = 'ClearityFoundationBiomarkers'
    end

    def create_claims
      create_interaction_claims
    end

    private

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'http://www.clearityfoundation.org/healthcare-pros/drugs-and-biomarkers.aspx',
          citation: 'http://www.clearityfoundation.org/healthcare-pros/drugs-and-biomarkers.aspx',
          site_url: 'https://www.clearityfoundation.org/healthcare-pros/drugs-and-biomarkers.aspx',
          source_db_version: '26-July-2013',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'Clearity Foundation Biomarkers',
          license: 'Unknown; data is no longer publicly available from site',
          license_link: 'https://www.clearityfoundation.org/about-clearity/contact/',
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def create_interaction_claims
      CSV.foreach(file_path, headers: true, col_sep: "\t") do |row|
        gene_claim = create_gene_claim(row['gene_name'].upcase, 'Gene Target Symbol')
        create_gene_claim_alias(gene_claim, row['entrez_gene_id'], 'Entrez Gene ID')
        create_gene_claim_attribute(gene_claim, 'Reported Genome Event Targeted', row['reported_gene_name'])

        drug_claim = create_drug_claim(row['drug_name'].upcase, 'Primary Drug Name')
        create_drug_claim_attribute(drug_claim, 'Drug Class', row['drug_class'])
        unless row['drug_trade_name'].blank?
          create_drug_claim_alias(drug_claim, row['drug_trade_name'], 'Drug Trade Name')
        end
        create_drug_claim_alias(drug_claim, row['pubchem_id'], 'PubChem Drug ID') unless row['pubchem_id'].blank?
        create_drug_claim_attribute(drug_claim, 'Drug Classification', row['drug_subclass'])
        unless row['linked_class_info'].blank?
          create_drug_claim_attribute(drug_claim, 'Link to Clearity Drug Class Schematic', row['linked_class_info'])
        end

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)
        create_interaction_claim_attribute(interaction_claim, 'Mechanism of Interaction', row['reported_drug_response'])
        # This currently doesn't appear to be an interaction type
        create_interaction_claim_type(interaction_claim, 'BIOMARKER')
        # TODO: should it be added?
        create_interaction_claim_link(interaction_claim, 'Source TSV', File.join('data', 'source_tsvs', 'ClearityFoundation_INTERACTIONS.tsv'))
      end
      backfill_publication_information
    end
  end
end; end; end; end;
