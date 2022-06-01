class RemoveGeneGeneInteractionFromSources < ActiveRecord::Migration[6.1]
  def up
    remove_column :sources, :gene_gene_interaction_claims_count
  end

  def down
    add_column :sources, :gene_gene_interaction_claims_count, :integer, default: 0
  end
end
