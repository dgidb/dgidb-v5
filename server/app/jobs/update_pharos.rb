class UpdatePharos < ApplicationJob
  def perform
    importer = Genome::Importers::ApiImporters::Pharos::Importer.new()
    importer.import
  end
end
