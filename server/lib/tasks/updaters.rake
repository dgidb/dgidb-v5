namespace :dgidb do
    namespace :update do

        desc 'update chembl'
        task chembl: :environment do
            chembl = Genome::Downloaders::ChemblDownloader.new
            if chembl.is_up_to_date
                puts('is current')
            else
                chembl.download_latest
                puts('file downloaded')
            end
        end

        # desc 'update drugbank'
        # task drugbank: :environment do
        #     nil
        # end

        # desc 'update guide_to_pharmacology'
        # task guide_to_pharmacology: :environment do
        #     nil
        # end

        # desc 'update my_cancer_genome'
        # task my_cancer_genome: :environment do
        #     nil
        # end

        # which other sources to include? (aka which aren't frozen from all sources)
        # API Importers: CIVIC, (froze)DOCM, GO, (frozen)JAX_CKB, PHAROS
        # FILE Importers: CGI, CARIS MOLECULAR INTELLIGENCE, CLEARITY FOUNDATION
        #                 COSMIC, DGENE, DTC, FDA, FOUNDATION ONE, HUMAN PROTEIN ATLAS,
        #                 IDG, NCI, MY CANCER GENOME, ONCOKB
        #
        # FOR SURE WILL NEED UPDATER TASKS: CIVIC, GO, PHAROS, DRUGBANK, CHEMBL, GTP
        #
        # Update workflow should be:
        # 1) Delete all groupings
        # 2) Update sources
        # 3) Update normalizers
        # 4) Run groupings
        #
        # desc 'all'
        # task all: :environment do
        #     nil
        # end
    end
end