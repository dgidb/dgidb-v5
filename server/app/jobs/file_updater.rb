class FileUpdater < Updater
    attr_reader :importer

    # Create a job per importer type, feed that as importer and grab all the relevant urls, filenames, etc
    # Run the perform block

    def perform(importer)
        download_file
        extract_data # from the downloaded file, only get the relevant fields
        wipe_existing
        import
        delete_file
    end

    def download_file
        # grab download method from specific updater
        # download methods
    end

    def extract_data
        # if there are any preprocessing methods for the downloaded file, they go here
    end

    def wipe_existing
        # wipe what is currently in db with corresponding source
        # not sure this is needed actually bc i think Transactions in ruby rails account for this?
    end

    def import
        # Download the file
        # Create importer from updater class
        # run import methods
    end

    def delete_file
        # Delete the downloaded file
    end

end
