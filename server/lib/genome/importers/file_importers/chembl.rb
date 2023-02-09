module Genome; module Importers; module FileImporters; module Chembl
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_accessor :chembl_data

    def initialize(file_path)
      @file_path = handle_file_location file_path
      @source_db_name = "ChEMBL"
    end

    def default_filetype
      'db'
    end

    def default_filename
      'chembl'
    end

    def create_claims
      query_chembl_db
      create_interaction_claims
    end

    def create_new_source
      @source ||= Source.create(
        {
          base_url: 'https://chembl.gitbook.io/chembl-interface-documentation/downloads',
          site_url: 'https://www.ebi.ac.uk/chembl/',
          citation: 'ChEMBL: towards direct deposition of bioassay data. Mendez D, Gaulton A, Bento AP, Chambers J, De Veij M, Félix E, Magariños MP, Mosquera JF, Mutowo P, Nowotka M, Gordillo-Marañón M, Hunter F, Junco L, Mugumbate G, Rodriguez-Lopez M, Atkinson F, Bosc N, Radoux CJ, Segura-Cabrera A, Hersey A, Leach AR. Nucleic Acids Res. 2019; 47(D1):D930-D940. doi: 10.1093/nar/gky1075',
          source_db_version: '15-Aug-2022',
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: 'The ChEMBL Bioactivity Database',
          license: License::CC_BY_SA_3_0,
          license_link: 'https://chembl.gitbook.io/chembl-interface-documentation/about'
        }
      )
      @source.source_types << SourceType.find_by(type: 'interaction')
      @source.save
    end

    def query_chembl_db
      db = SQLite3::Database.open file_path
      db.results_as_hash = true
      @chembl_data = db.execute(
        "SELECT md.chembl_id AS chembl_id,
               md.pref_name AS drug_name,
               md.withdrawn_flag AS withdrawn_flag,
               cast(md.max_phase AS text) AS max_phase,
               dm.mechanism_of_action AS moa_description,
               dm.action_type AS interaction_type,
               cast(dm.direct_interaction AS text) AS is_direct_interaction,
               td.chembl_id AS target_chembl_id,
               cseq.accession AS uniprot_acc,
               cseq.description AS target_description,
               csyn.component_synonym AS target_gene_symbol
        FROM drug_mechanism dm
                 JOIN molecule_dictionary md on md.molregno = dm.molregno
                 LEFT JOIN target_dictionary td on td.tid = dm.tid
                 LEFT JOIN action_type at on dm.action_type = at.action_type
                 LEFT JOIN target_components tc on tc.tid = td.tid
                 LEFT JOIN component_sequences cseq on tc.component_id = cseq.component_id
                 LEFT JOIN component_synonyms csyn on cseq.component_id = csyn.component_id
            AND csyn.syn_type = 'GENE_SYMBOL'"
      )
    end

    def create_interaction_claims
      @chembl_data.each do |row|
        primary_drug_name = row['drug_name'].strip.upcase
        drug_claim = create_drug_claim(primary_drug_name)
        create_drug_claim_alias(drug_claim, "chembl:#{row['chembl_id']}", DrugNomenclature::CHEMBL_ID)
        create_drug_claim_approval_rating(drug_claim, "Max Phase #{row['max_phase']}") unless row[5].nil?
        create_drug_claim_approval_rating(drug_claim, 'Withdrawn') if row[3] == 1

        next if row['chembl_id'].nil? || row['target_gene_symbol'].nil?

        gene_claim = create_gene_claim(row['target_gene_symbol'].upcase)
        create_gene_claim_alias(gene_claim, "chembl:#{row['target_chembl_id']}", GeneNomenclature::CHEMBL_ID)
        create_gene_claim_alias(gene_claim, row['target_description'], GeneNomenclature::DESCRIPTION)
        create_gene_claim_alias(gene_claim, "uniprot:#{row['uniprot_acc']}", GeneNomenclature::UNIPROTKB_ID)

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)

        create_interaction_claim_type(interaction_claim, row['interaction_type'])
        direct_interaction = row['is_direct_interaction'] == '1' ? 'true' : 'false'
        create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::DIRECT, direct_interaction)
        create_interaction_claim_link(interaction_claim, 'Source', File.join('data', 'chembl_31.db'))
        create_interaction_claim_attribute(interaction_claim, InteractionAttributeName::MOA, row['moa_description'])
      end
    end
  end
end; end; end; end
