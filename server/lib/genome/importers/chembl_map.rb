module Genome
    module Importers
        module Chembl

            class ChemblAttributes
                attribute :drug_chembl_id
                attribute :drug_name
                attribute :gene_chembl_id
                attribute :gene_symbol, Array, delimiter: '|'
                attribute :uniprot_id, Array, delimiter: '|'
                attribute :uniprot_name, Array, delimiter: '|'
                attribute :action_type
                attribute :mechanism_of_action
                attribute :direct_interaction
                attribute :fda, Array, delimiter: '|'
                attribute :pmid, Array, delimiter: '|'
                attribute :tax_id # Must be 9606 to be valid

            end

            class ChemblMap

                # Some magic to define which tables are needed

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
