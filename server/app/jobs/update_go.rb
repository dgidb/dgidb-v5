class UpdateGo < ApplicationJob
  def perform
    importer = Genome::Importers::ApiImporters::Go::Importer.new()
    importer.import
  end
end
