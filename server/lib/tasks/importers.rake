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

    # File importers
    file_importer_glob = File.join(Rails.root, 'lib/genome/importers/file_importers/*')
    Dir.glob(file_importer_glob).reject { |path| path =~ /guide_to_pharmacology/ }.each do |importer_path|
      importer_filename = File.basename(importer_path, '.rb')
      importer_name = importer_filename.camelize
      send(
        :desc,
        "Import #{importer_filename} from a provided file. If the source already exists, it will be overwritten!"
      )
      send(
        :task,
        importer_filename,
        %i[file_path gene_group drug_group] => :environment
      ) do |_, args|
        args.with_defaults(file_path: nil, gene_group: 'false',
                           drug_group: 'false')
        importer_class = "Genome::Importers::FileImporters::#{importer_name}::Importer".constantize
        if Source.where('lower(sources.source_db_name) = ?', importer_name.downcase).any?
          puts 'Found existing source! Deleting...'
          Utils::Database.delete_source(importer_name)
        end

        puts 'Starting import!'
        importer_instance = importer_class.new(args[:file_path])
        importer_instance.import

        handle_group_params(args[:gene_group], args[:drug_group])
      end
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

    # API importers
    api_importer_glob = File.join(Rails.root, 'lib/genome/importers/api_importers/*/')
    Dir.glob(api_importer_glob).each do |importer_path|
      importer_dir = File.basename(importer_path)
      importer_name = importer_dir.camelize
      send(
        :desc,
        "Import #{importer_name} from source API. If the source already exists, it will be overwritten!"
      )
      send(
        :task,
        importer_dir,
        %i[gene_group drug_group] => :environment
      ) do |_, args|
        args.with_defaults(gene_group: 'false', drug_group: 'false')
        importer_class = "Genome::Importers::ApiImporters::#{importer_name}::Importer".constantize
        if Source.where('lower(sources.source_db_name) = ?', importer_name.downcase).any?
          puts 'Found existing source! Deleting...'
          Utils::Database.delete_source(importer_name)
        end

        puts 'Starting import!'
        importer_instance = importer_class.new
        importer_instance.import

        handle_group_params(args[:gene_group], args[:drug_group])
      end
    end
  end
end
