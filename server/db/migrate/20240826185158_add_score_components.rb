class AddScoreComponents < ActiveRecord::Migration[6.1]
  def change
    add_column :interactions, :drug_specificity, :float
    add_column :interactions, :gene_specificity, :float
    add_column :interactions, :evidence_score, :integer
  end
end
