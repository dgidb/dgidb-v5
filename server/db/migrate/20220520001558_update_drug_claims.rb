class UpdateDrugClaims < ActiveRecord::Migration[6.1]
  def up
    remove_column :drug_claims, :primary_name
  end

  def down
    add_column :drug_claims, :primary_name, :string, limit: 255
  end
end
