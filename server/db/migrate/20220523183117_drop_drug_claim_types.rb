class DropDrugClaimTypes < ActiveRecord::Migration[6.1]
  def change
    drop_table :drug_claim_types_drug_claims
    drop_table :drug_claim_types
  end
end
