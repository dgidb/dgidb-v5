class UpdateCivic < ApplicationJob
  def perform
    importer = Genome::Importers::ApiImporters::Civic::Importer.new()
    importer.import
  end
end
