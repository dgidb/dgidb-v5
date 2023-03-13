class EnableCaseInsensitiveConceptIdLookup < ActiveRecord::Migration[6.1]
  def up
    execute "CREATE UNIQUE INDEX index_drugs_on_concept_id ON drugs USING btree (upper(concept_id));"
    # there isn't an existing index just for drug concept IDs, just genes
    remove_index :genes, name: "index_genes_on_concept_id"
    execute "CREATE UNIQUE INDEX index_genes_on_concept_id ON genes USING btree (upper(concept_id));"
  end

  def down
    execute "DROP INDEX index_drugs_on_concept_id"
    execute "DROP INDEX index_genes_on_concept_id;"
    add_index :genes, :concept_id, :unique => true
  end
end
