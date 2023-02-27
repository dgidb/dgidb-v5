class AddMetadataToSources < ActiveRecord::Migration[6.1]
  def up
    add_column :sources, :citation_short, :string
    add_column :sources, :pmid, :string
    add_column :sources, :pmcid, :string
    add_column :sources, :doi, :string
  end

  def down
    remove_column :sources, :citation_short, :string
    remove_column :sources, :pmid, :string
    remove_column :sources, :pmcid, :string
    remove_column :sources, :doi, :string
  end
end
