class AddIndexes < ActiveRecord::Migration[6.1]
  def change
    add_index :genes, :name
    add_index :gene_aliases, :alias
  end
end
