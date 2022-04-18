class UpdateGeneConceptIdType < ActiveRecord::Migration[6.1]
  def change
    change_column :genes, :concept_id, :varchar, null: false
  end
end
