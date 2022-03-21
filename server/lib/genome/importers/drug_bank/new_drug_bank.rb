require 'genome/online_updater'

module Genome
  module Importers
    module DrugBank
      class NewDrugBank < Genome::OnlineUpdater
        attr_reader :file_path, :source

        def initialize(file_path)
          @file_path = file_path
        end

        def import
          remove_existing_source
          create_source
          import_claims
        end

        private

        DELIMITER = ';'.freeze

        def remove_existing_source
          Utils::Database.delete_source('DrugBank')
        end

        def create_source
          @source = DataModel::Source.where(
            base_url: 'http://www.drugbank.ca',
            site_url: 'http://www.drugbank.ca/',
            citation: "Wishart,D.S., Feunang,Y.D., Guo,A.C., Lo,E.J., Marcu,A., Grant,J.R., Sajed,T., Johnson,D., Li,C., Sayeeda,Z., et al. (2018) DrugBank 5.0: a major update to the DrugBank database for 2018. Nucleic Acids Res., 46, D1074–D1082. PMID: 29126136",
            source_db_version: '5.1.7',
            source_db_name: 'DrugBank',
            full_name: 'DrugBank - Open Data Drug & Drug Target Database',
            license: 'Custom non-commercial',
            license_link: 'https://dev.drugbankplus.com/guides/drugbank/citing?_ga=2.29505343.1251048939.1591976592-781844916.1591645816'
            # source_trust_level_id: DataModel::SourceTrustLevel.EXPERT_CURATED
          ).first_or_create
          @source.source_types << DataModel::SourceType.find_by(type: 'interaction')
          @source.save
        end

        def import_claims
          CSV.foreach(file_path, :col_sep => "\t", :headers => true) do |row|
            drug_claim = create_drug_claim(row['drug_id'].upcase, row['drug_name'], 'DrugBank Drug Identifier')

            create_drug_claim_alias(drug_claim, row['drug_name'].upcase, 'DrugBank Drug Name')
            row['drug_synonyms'].split(DELIMITER).each do |synonym|
              create_drug_claim_alias(drug_claim, synonym, 'Drug Synonym') unless synonym == 'N/A'
            end
            create_drug_claim_alias(drug_claim, row['drug_cas_number'], 'CAS Number') unless row['drug_cas_number'] == 'N/A'
            row['drug_brands'].split(DELIMITER).each do |synonym|
              create_drug_claim_alias(drug_claim, synonym, 'Drug Brand') unless synonym == 'N/A'
            end
            create_drug_claim_alias(drug_claim, row['chembl_id'], 'ChEMBL ID') unless row['chembl_id'] == 'N/A'

            create_drug_claim_attribute(drug_claim, 'Drug Type', row['drug_type']) unless row['drug_type'] == 'N/A'
            row['drug_groups'].split(DELIMITER).each do |group|
              create_drug_claim_attribute(drug_claim, 'Drug Groups', group) unless group == 'N/A'
            end
            row['drug_categories'].split(DELIMITER).each do |category|
              create_drug_claim_attribute(drug_claim, 'Drug Categories', category) unless category == 'N/A'
            end

            gene_claim = create_gene_claim(row['gene_id'], 'DrugBank Gene Identifier')
            create_gene_claim_alias(gene_claim, row['gene_symbol'], 'DrugBank Gene Name') unless row['gene_symbol'] == 'N/A'
            create_gene_claim_alias(gene_claim, row['uniprot_id'], 'UniProt Accession') unless row['uniprot_id'] == 'N/A'
            create_gene_claim_alias(gene_claim, row['entrez_id'], 'Entrez Gene Id') unless row['entrez_id'] == 'N/A'
            create_gene_claim_alias(gene_claim, row['ensembl_id'], 'Ensembl Gene Id') unless row['ensembl_id'] == 'N/A'

            interaction_claim = create_interaction_claim(gene_claim, drug_claim)
            row['target_actions'].split(DELIMITER).each do |type|
              create_interaction_claim_type(interaction_claim, type) unless type == 'N/A'
            end
            row['pmid'].split(DELIMITER).each do |pmid|
              create_interaction_claim_publication(interaction_claim, pmid) unless pmid == 'N/A' || pmid == 'None' || pmid.blank? || pmid.zero?
            end
            create_interaction_claim_link(interaction_claim, 'Drug Target', "https://www.drugbank.ca/drugs/#{row['drug_id']}#targets")
            interaction_claim.save
          end
          backfill_publication_information
        end
      end
    end
  end
end
