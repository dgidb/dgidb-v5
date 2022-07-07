class UpdateDocm < ApplicationJob
  def perform
    importer = Genome::Importers::ApiImporters::Docm::Importer.new()
    importer.import
  end
end
