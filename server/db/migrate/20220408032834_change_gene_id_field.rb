class ChangeGeneIdField < ActiveRecord::Migration[6.1]
  def self.up
    rename_column :genes, :entrez_id, :concept_id
  end

  def self.down
    rename_column :genes, :concept_id, :entrez_id
  end
end
