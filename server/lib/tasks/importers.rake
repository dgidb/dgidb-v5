namespace :dgidb do
  namespace :import do
    # Rake tasks are automatically generated for TSV and API importers.

    # TSV importer files should be located in:
    # lib/genome/importers/tsv_importers/<source>.rb
    # They should define an Importer class per the following namespace:
    # Genome::Importers::TsvImporters::<SourceName>::Importer

    # API importer files should be located in:
    # lib/genome/importers/api_importers/<source_name>/importer.rb
    # They should define an Imoprter class per the following namespace:
    # Genome::Importers::ApiImporters::<SourceName>::Importer

    def handle_group_params(gene_group, drug_group)
      if gene_group == 'true'
        puts 'Running Gene Grouper - this takes awhile!'
        Genome::Groupers::GeneGrouper.run
      end
      if drug_group == 'true'
        puts 'Running Drug Grouper - this takes awhile!'
        Genome::Groupers::DrugGrouper.run
      end
      if gene_group == 'true' || drug_group == 'true'
        puts 'Populating source counters.'
        Genome::Normalizers::PopulateCounters.populate_source_counters
        puts 'Attempting to normalize drug types.'
        Genome::Normalizers::DrugTypeNormalizers.normalize_types
        puts 'Filling in source trust levels'
        Genome::Normalizers::SourceTrustLevel.populate_trust_levels
        puts 'Attempting to normalize interaction types'
        Genome::Normalizers::InteractionClaimType.normalize_types
      end
      puts 'Clearing cache'
      Rails.cache.clear
      puts 'Done.'
    end

    tsv_importer_glob = File.join(Rails.root, 'lib/genome/importers/tsv_importers/*')
    Dir.glob(tsv_importer_glob).each do |importer_path|
      importer_filename = File.basename(importer_path, '.rb')
      importer_name = importer_filename.camelize
      send(
        :desc,
        "Import #{importer_filename} from a provided tsv file. If the source already exists, it will be overwritten!"
      )
      send(
        :task,
        importer_filename,
        %i[tsv_path gene_group drug_group] => :environment
      ) do |_, args|
        importer_class = "Genome::Importers::TsvImporters::#{importer_name}::Importer".constantize
        if Source.where('lower(sources.source_db_name) = ?', importer_name.downcase).any?
          puts 'Found existing source! Deleting...'
          Utils::Database.delete_source(importer_name)
        end

        puts 'Starting import!'
        importer_instance = importer_class.new(args[:tsv_path])
        importer_instance.create_claims

        handle_group_params(args[:gene_group], args[:drug_group])
      end
    end

    api_importer_glob = File.join(Rails.root, 'lib/genome/importers/api_importers/*/')
    Dir.glob(api_importer_glob).each do |importer_path|
      importer_dir = File.basename(importer_path)
      importer_name = importer_dir.camelize
      send(
        :desc,
        "Import #{importer_name} from a provided tsv file. If the source already exists, it will be overwritten!"
      )
      send(
        :task,
        importer_dir,
        %i[gene_group drug_group] => :environment
      ) do |_, args|
        importer_class = "Genome::Importers::ApiImporters::#{importer_name}::Importer".constantize
        if Source.where('lower(sources.source_db_name) = ?', importer_name.downcase).any?
          puts 'Found existing source! Deleting...'
          Utils::Database.delete_source(importer_name)
        end

        puts 'Starting import!'
        importer_instance = importer_class.new
        importer_instance.create_claims

        handle_group_params(args[:gene_group], args[:drug_group])
      end
    end

    # desc 'import Entrez gene pathway information from a TSV file'
    # task :entrez_pathway, [:tsv_path] => :environment do |_t, args|
    #   Genome::Importers::Entrez::EntrezGenePathwayImporter.new(args[:tsv_path])
    #     .import!
    # end

    # desc 'import PubChem synonyms for drug claims'
    # task :pubchem, [] => :environment do
    #   Genome::Updaters::GetPubchem.run!
    # end
  end
end
