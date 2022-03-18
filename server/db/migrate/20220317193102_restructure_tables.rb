class RestructureTables < ActiveRecord::Migration[6.1]
  def change
    drop_table :gene_gene_interaction_claim_attributes
    drop_table :gene_gene_interaction_claims
    drop_table :drug_aliases_sources
  end
end
