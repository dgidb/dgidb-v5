class UpdateCkb < ApplicationJob
  def perform
    importer = Genome::Importers::ApiImporters::JaxCkb::Importer.new()
    importer.import
  end
end
