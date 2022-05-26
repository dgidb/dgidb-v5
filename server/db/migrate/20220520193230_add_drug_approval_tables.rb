class AddDrugApprovalTables < ActiveRecord::Migration[6.1]
  def up
    create_table :drug_claim_approval_ratings, id: :uuid do |t|
      t.string :rating, null: false
    end

    add_reference :drug_claim_approval_ratings, :drug_claim, foreign_key: true, type: :text

    create_table :drug_approval_ratings, id: :uuid do |t|
      t.string :rating, null: false
    end

    add_reference :drug_approval_ratings, :drug, foreign_key: true, type: :text
    add_reference :drug_approval_ratings, :source, foreign_key: true, type: :text
  end

  def down
    drop_table :drug_claim_approval_ratings
    drop_table :drug_approval_ratings
  end
end
