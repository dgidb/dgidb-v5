module Genome
    module Importers
        module Chembl

            require 'sqlite3'

            class ChemblRow

                attr_accessor :drug_chembl_id
                attr_accessor :drug_name
                attr_accessor :gene_chembl_id
                attr_accessor :gene_symbol
                attr_accessor :uniprot_id
                attr_accessor :uniprot_name
                attr_accessor :action_type
                attr_accessor :mechanism_of_action
                attr_accessor :direct_interaction
                attr_accessor :fda

                def initialize(row)
                    @drug_chembl_id = row[1]
                    @drug_name = row[2]
                    @gene_chembl_id = row[6]
                    @gene_symbol = row[9]
                    @uniprot_id = row[8]
                    @uniprot_name = row[9]
                    @action_type = row[0]
                    @mechanism_of_action = row[3]
                    @direct_interaction = row[4]
                    @fda = row[5]
                end


                # attr_accessor :pmid, Array, delimiter: '|'
                # attr_accessor :tax_id # Must be 9606 to be valid
            end

            class ChemblDatabase

                require 'sqlite3'

                attr_accessor :db
                attr_accessor :query

                def initialize()
                    @db = SQLite3::Database.open 'db/chembl_30.db'
                end

                def query()
                    db.execute( "select drug_mechanism.action_type,
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
                                    ) do |entry|
                                        p entry
                                        @row = ChemblRow.new(entry)
                                        p row.action_type
                                        p row.drug_name
                                    end
                end
            end


        end
    end
end

#
# DGIDB MAPPING         -> CHEMBL MAPPING
# field_name            -> table_name: field_name                   (access notes)
#
# drug_chembl_id        -> molecular_dictionary: chembl_id
# drug_name             -> molecular_dictionary: pref_name
# gene_chembl_id        -> target_dictionary: chembl_id
# gene_symbol           -> component_synonyms: component_synonym    (linked from component_sequences by component_id)
# uniprot_id            -> component_sequences: accession
# uniprot_name          -> component_sequences: description
# action_type           -> drug_mechanism: action_type
# mechanism_of_action   -> drug_mechanism: mechanism_of_action
# direct_interaction    -> drug_mechanism: direct_interaction
# fda                   -> molecular_dictionary: max_phase
# pmid                  -> docs: pubmed_id                          (linked by doc_id, molregno)
# tax_id                -> 9606                                     (homo sapien taxonomy ID)
#
#
#
