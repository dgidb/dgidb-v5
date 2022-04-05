namespace :dgidb do
  namespace :import do
    # Rake tasks are automatically generated for file and API importers.

    # File importer modules should be located in:
    # lib/genome/importers/file_importers/<source>.rb
    # They should define an Importer class per the following namespace:
    # Genome::Importers::FileImporters::<SourceName>::Importer

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

    def file_importer_names
      file_importer_glob = File.join(Rails.root, 'lib/genome/importers/file_importers/*')
      Dir.glob(file_importer_glob).map { |path| File.basename(path, '.rb') }
    end

    def run_file_import(importer_filename, args)
      importer_name = importer_filename.camelize
      args.with_defaults(file_path: nil, gene_group: 'false', drug_group: 'false')
      importer_class = "Genome::Importers::FileImporters::#{importer_name}::Importer".constantize
      puts "Running #{importer_name} importer..."
      if Source.where('lower(sources.source_db_name) = ?', importer_name.downcase).any?
        puts 'Found existing source! Deleting...'
        Utils::Database.delete_source(importer_name)
      end

      puts 'Starting import!'
      importer_instance = importer_class.new(args[:file_path])
      importer_instance.import
      handle_group_params(args[:gene_group], args[:drug_group])
    end

    def api_importer_names
      api_importer_glob = File.join(Rails.root, 'lib/genome/importers/api_importers/*/')
      Dir.glob(api_importer_glob).map { |path| File.basename(path) }
    end

    # Guide to Pharmacology is a special case because it needs two input files
    gtop_name = 'guide_to_pharmacology'
    send(
      :desc,
      'Import GuideToPharmacology from provided CSV files. If the source already exists, it will be overwritten!'
    )
    send(
      :task,
      gtop_name,
      %i[interaction_file_path gene_file_path gene_group drug_group] => :environment
    ) do |_, args|
      args.with_defaults(
        interaction_file_path: 'lib/data/guide_to_pharmacology/interactions.csv',
        gene_file_path: 'lib/data/guide_to_pharmacology/targets_and_families.csv',
        gene_group: false,
        drug_group: false
      )
      importer_class = Genome::Importers::FileImporters::GuideToPharmacology::Importer
      if Source.where('lower(sources.source_db_name) = ?', 'guidetopharmacology').any?
        puts 'Found existing source! Deleting...'
        Utils::Database.delete_source('GuideToPharmacology')
      end
      puts 'Starting import!'
      importer_instance = importer_class.new(args[:interaction_file_path], args[:gene_file_path])
      importer_instance.import

      handle_group_params(args[:gene_group], args[:drug_group])
    end

    def run_api_import(importer_filename, args)
      importer_name = importer_filename.camelize
      args.with_defaults(gene_group: 'false', drug_group: 'false')
      importer_class = "Genome::Importers::ApiImporters::#{importer_name}::Importer".constantize
      puts "Running #{importer_name} importer..."
      if Source.where('lower(sources.source_db_name) = ?', importer_name.downcase).any?
        puts 'Found existing source! Deleting...'
        Utils::Database.delete_source(importer_name)
      end

      puts 'Starting import!'
      importer_instance = importer_class.new
      importer_instance.import

      handle_group_params(args[:gene_group], args[:drug_group])
    end

    send(:desc, 'Run all importers')
    send(:task, 'all', %i[gene_group drug_group] => :environment) do |_, args|
      file_importer_names.each do |name|
        run_file_import(name, args.dup)
      end
      api_importer_names.each do |name|
        run_api_import(name, args.dup)
      end
    end

    file_importer_names.each do |importer_filename|
      send(:desc, "Import #{importer_filename.camelize} from a provided file. If the source already exists, it will be overwritten!")
      send(:task, importer_filename, %i[file_path gene_group drug_group] => :environment) do |_, args|
        run_file_import(importer_filename, args)
      end
    end

    api_importer_names.each do |importer_path|
      importer_filename = File.basename(importer_path)
      send(:desc, "Import #{importer_filename.camelize} from source API endpoint. If the source already exists, it will be overwritten!")
      send(:task, importer_filename, %i[gene_group drug_group] => :environment) do |_, args|
        run_api_import(importer_filename, args)
      end
    end
  end
end
