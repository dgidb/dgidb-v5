module Genome; module Importers; module TsvImporters; module Chembl;
  class Importer < Genome::Importers::Base
    attr_reader :file_path
    def initialize(file_path)
      @file_path = file_path
      @source_db_name = 'CancerCommons'
    end


    def create_new_source
        @source ||= Source.create(
          {
            base_url: 'https://chembl.gitbook.io/chembl-interface-documentation/downloads',
            site_url: 'https://www.ebi.ac.uk/chembl/',
            citation: 'ChEMBL: towards direct deposition of bioassay data. Mendez D, Gaulton A, Bento AP, Chambers J, De Veij M, Félix E, Magariños MP, Mosquera JF, Mutowo P, Nowotka M, Gordillo-Marañón M, Hunter F, Junco L, Mugumbate G, Rodriguez-Lopez M, Atkinson F, Bosc N, Radoux CJ, Segura-Cabrera A, Hersey A, Leach AR. Nucleic Acids Res. 2019; 47(D1):D930-D940. doi: 10.1093/nar/gky1075',
            source_db_version: '09-Mar-2022',
            source_trust_level_id: SourceTrustLevel.EXPERT_CURATED,
            source_db_name: source_db_name,
            full_name: 'The ChEMBL Bioactivity Database',
            license: 'Creative Commons Attribution-Share Alike 3.0 Unported License',
            license_link: 'https://chembl.gitbook.io/chembl-interface-documentation/about'
          }
        )
        @source.source_types << SourceType.find_by(type: 'interaction')
        @source.save
      end

    def query_chembl_db
        db = SQLite3::Database.open file_path
        db.results_as_hash = true
        @chembl_data = db.execute( "select drug_mechanism.action_type,
                                    molecule_dictionary.chembl_id,
                                    molecule_dictionary.pref_name,
                                    drug_mechanism.mechanism_of_action,
                                    drug_mechanism.direct_interaction,
                                    molecule_dictionary.max_phase,
                                    target_dictionary.chembl_id,
                                    target_components.targcomp_id,
                                    component_sequences.accession,
                                    component_sequences.description,
                                    component_synonyms.component_synonym
                            from drug_mechanism
                            join molecule_dictionary on molecule_dictionary.molregno = drug_mechanism.molregno
                            join target_dictionary on target_dictionary.tid = drug_mechanism.tid
                            join target_components on target_components.tid = target_dictionary.tid
                            join component_sequences on target_components.component_id = component_sequences.component_id
                            join component_synonyms on component_sequences.component_id = component_synonyms.component_id and component_synonyms.syn_type = 'GENE_SYMBOL'"
                            )
    end

    def create_interaction_claims
        chembl_data.each do |row|
            # create drug claims
            # create gene claims
            # create interaction c laims
        end
    end


end
