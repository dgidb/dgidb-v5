module Genome; module Importers; module FileImporters; module Chembl
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    attr_accessor :chembl_data

    def initialize(file_path)
      @file_path = file_path
      @source_db_name = "ChEMBL"
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
          source_db_version: "02-Feb-2022",
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
      @chembl_data = db.execute("SELECT drug_mechanism.action_type,
                                    molecule_dictionary.chembl_id,
                                    molecule_dictionary.pref_name,
                                    drug_mechanism.mechanism_of_action,
                                    cast(drug_mechanism.direct_interaction as text),
                                    cast(molecule_dictionary.max_phase as text),
                                    target_dictionary.chembl_id,
                                    target_components.targcomp_id,
                                    component_sequences.accession,
                                    component_sequences.description,
                                    component_synonyms.component_synonym
                            FROM drug_mechanism
                            JOIN molecule_dictionary on molecule_dictionary.molregno = drug_mechanism.molregno
                            JOIN target_dictionary on target_dictionary.tid = drug_mechanism.tid
                            JOIN target_components on target_components.tid = target_dictionary.tid
                            JOIN component_sequences on target_components.component_id = component_sequences.component_id
                            JOIN component_synonyms on component_sequences.component_id = component_synonyms.component_id AND component_synonyms.syn_type = 'GENE_SYMBOL'")
    end

    def create_interaction_claims
      @chembl_data.each do |row|
        gene_claim = create_gene_claim(row[9].upcase, "Gene Target Symbol")
        create_gene_claim_attribute(gene_claim, "UniProt accession", row[8])

        primary_name = row[2].strip.upcase
        drug_claim = create_drug_claim(primary_name, primary_name, "Primary Drug Name")
        create_drug_claim_attribute(drug_claim, "ChEMBL Max Phase", row[5])
        create_drug_claim_alias(drug_claim, row[1], "ChEMBL ID")

        interaction_claim = create_interaction_claim(gene_claim, drug_claim)

        create_interaction_claim_type(interaction_claim, row[0])
        direct_interaction = row[9] == "1" ? "true" : "false"
        create_interaction_claim_attribute(interaction_claim, "Direct Interaction", direct_interaction)
        create_interaction_claim_attribute(interaction_claim, "Mechanism of Action", row[3])
        create_interaction_claim_link(interaction_claim, "Source", File.join("data", "chembl_30.db"))
      end
    end
  end
end; end; end; end