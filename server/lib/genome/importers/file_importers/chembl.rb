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
          base_url: "https://chembl.gitbook.io/chembl-interface-documentation/downloads",
          site_url: "https://www.ebi.ac.uk/chembl/",
          citation: "ChEMBL: towards direct deposition of bioassay data. Mendez D, Gaulton A, Bento AP, Chambers J, De Veij M, Félix E, Magariños MP, Mosquera JF, Mutowo P, Nowotka M, Gordillo-Marañón M, Hunter F, Junco L, Mugumbate G, Rodriguez-Lopez M, Atkinson F, Bosc N, Radoux CJ, Segura-Cabrera A, Hersey A, Leach AR. Nucleic Acids Res. 2019; 47(D1):D930-D940. doi: 10.1093/nar/gky1075",
          source_db_version: "15-Aug-2022",
          source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
          source_db_name: source_db_name,
          full_name: "The ChEMBL Bioactivity Database",
          license: "Creative Commons Attribution-Share Alike 3.0 Unported License",
          license_link: "https://chembl.gitbook.io/chembl-interface-documentation/about",
        }
      )
      @source.source_types << SourceType.find_by(type: "interaction")
      @source.save
    end

    def query_chembl_db
      db = SQLite3::Database.open file_path
      db.results_as_hash = false
      @chembl_data = db.execute(
        "SELECT
          drug_mechanism.action_type,
          molecule_dictionary.chembl_id,
          molecule_dictionary.pref_name,
          molecule_dictionary.withdrawn_flag,
          drug_mechanism.mechanism_of_action,
          cast(molecule_dictionary.max_phase as text),
          cast(drug_mechanism.direct_interaction as text),
          target_dictionary.chembl_id,
          target_components.targcomp_id,
          component_sequences.accession,
          component_sequences.description,
          component_synonyms.component_synonym
        FROM drug_mechanism
        JOIN molecule_dictionary on molecule_dictionary.molregno = drug_mechanism.molregno
        LEFT JOIN target_dictionary on target_dictionary.tid = drug_mechanism.tid
        LEFT JOIN target_components on target_components.tid = target_dictionary.tid
        LEFT JOIN component_sequences on target_components.component_id = component_sequences.component_id
        LEFT JOIN component_synonyms on component_sequences.component_id = component_synonyms.component_id AND component_synonyms.syn_type = 'GENE_SYMBOL'"
      )
    end

    def create_interaction_claims
      @chembl_data.each do |row|
        primary_drug_name = row[2].strip.upcase
        drug_claim = create_drug_claim(primary_drug_name, "Primary Drug Name")
        create_drug_claim_alias(drug_claim, "chembl:#{row[1]}", 'ChEMBL ID')
        create_drug_claim_approval_rating(drug_claim, "Max Phase #{row[5]}") unless row[5].nil?
        create_drug_claim_approval_rating(drug_claim, 'Withdrawn') unless row[3] != 1

        next if row[0].nil? || row[11].nil?

        gene_claim = create_gene_claim(row[11].upcase, "Target Gene Symbol")
        create_gene_claim_alias(gene_claim, "chembl:#{row[7]}", 'ChEMBL ID')
        create_gene_claim_alias(gene_claim, row[10], "Target Description")
        create_gene_claim_alias(gene_claim, "uniprot:#{row[9]}", 'UniProtKB ID')

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)

        create_interaction_claim_type(interaction_claim, row[4])
        direct_interaction = row[6] == "1" ? "true" : "false"
        create_interaction_claim_attribute(interaction_claim, "Direct Interaction", direct_interaction)
        create_interaction_claim_link(interaction_claim, "Source", File.join("data", "chembl_30.db"))
        create_interaction_claim_attribute(interaction_claim, "Mechanism of Action", row[5])
      end
    end
  end
end; end; end; end
