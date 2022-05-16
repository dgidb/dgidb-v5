class AddInteractionScoreToInteractions < ActiveRecord::Migration[6.1]
  def change
    add_column :interactions, :score, :decimal, index: true
  end
end
