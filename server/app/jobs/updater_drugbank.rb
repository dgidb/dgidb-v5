class UpdateDrugbank < FileUpdater
    attr_reader: :file

    def create_importer
        Genome::Importers::FileImporters::DrugBank::Importer.new(file)
    end

    def download_file
        uri = URI('https://go.drugbank.com/releases/5-1-10/downloads/all-full-database')
        # credentials = ENV_LOGIN, ENV_PW  -- grab these variables from the environment
        # @file = download the file
    end

end
