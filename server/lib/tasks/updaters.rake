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
                puts('importing...')
                importer = Genome::Importers::FileImporters::Chembl::Importer.new('lib/data/chembl/chembl.db')
                importer.create_new_source # Remove old source?
                importer.create_claims
                puts('import complete!')
            end
        end

        desc 'update drugbank'
        task drugbank: :environment do
            drugbank = Genome::Downloaders::DrugBankDownloader.new()
            if drugbank.is_up_to_date
                puts('is current')
            else
                drugbank.download_latest
                puts('file downloaded')
                puts('importing...')
                importer = Genome::Importers::FileImporters::Drugbank::Importer.new('lib/data/drugbank/claims.xml')
                importer.create_new_source # Remove old source?
                importer.create_claims
                puts('import complete!')
            end
        end

        desc 'update guide_to_pharmacology'
        task guide_to_pharmacology: :environment do
            guide_to_pharmacology = Genome::Downloaders::GuideToPharmacologyDownloader.new()
            if guide_to_pharmacology.is_up_to_date
                puts('is current')
            else
                guide_to_pharmacology.download_latest
                puts('file downloaded')
                puts('deleting old data...')
                if Source.where('lower(sources.source_db_name) = ?', 'GuideToPharmacology'.downcase).any?
                    Utils::Database.delete_source('GuideToPharmacology')
                end
                puts('importing...')
                importer = Genome::Importers::FileImporters::GuideToPharmacology::Importer.new('lib/data/guide_to_pharmacology/interactions.csv',
                                                                                               'lib/data/guide_to_pharmacology/targets_and_families.csv')
                importer.create_new_source
                importer.create_claims
                puts('import complete!')
            end
        end

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