class AddDrugApplicationTable < ActiveRecord::Migration[6.1]
  def up
    create_table :drug_applications, id: :uuid do |t|
      t.string :app_no
    end

    add_reference :drug_applications, :drug, foreign_key: true, type: :text
  end

  def down
    drop_table :drug_applications
  end
end
