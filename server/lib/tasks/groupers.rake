namespace :dgidb do
  namespace :group do
    def delete_all
      Utils::Database.delete_interactions
      delete_genes
      delete_drugs
    end

    def delete_drugs
      Utils::Logging.without_sql do
        Utils::Database.delete_drugs
        ['RxNorm', 'Wikidata', 'ChemIDplus', 'NCIt', 'Drugs@FDA', 'HemOnc'].each do |source_name|
          Utils::Database.delete_source(source_name)
        end
      end
    end

    def delete_genes
      Utils::Logging.without_sql do
        Utils::Database.delete_genes
        %w[NCBI HGNC Ensembl].each do |source_name|
          Utils::Database.delete_source(source_name)
        end
      end
    end

    desc 'run the gene grouper'
    task genes: :environment do
      time = Benchmark.measure do
        Utils::Logging.without_sql do
          Genome::Groupers::GeneGrouper.new.run
        end
      end
      puts "Grouped genes in #{time.real.truncate(2)}s"
    end

    desc 'run the drug grouper'
    task drugs: :environment do
      time = Benchmark.measure do
        Utils::Logging.without_sql do
          Genome::Groupers::DrugGrouper.new.run
        end
      end
      puts "Grouped drugs in #{time.real.truncate(2)}s"
    end

    desc 'run the interaction grouper'
    task interactions: :environment do
      time = Benchmark.measure do
        Utils::Logging.without_sql do
          Genome::Groupers::InteractionGrouper.run
        end
      end
      puts "Grouped interactions in #{time.real.truncate(2)}s"
    end

    desc 'erase drug groupings'
    task erase_drugs: :environment do
      puts 'Deleting drug groups...'
      time = Benchmark.measure { delete_drugs }
      puts "Deleted drug groups in #{time.real}s"
    end

    desc 'erase gene groupings'
    task erase_genes: :environment do
      puts 'Deleting gene groups...'
      time = Benchmark.measure { delete_genes }
      puts "Deleted gene groups in #{time.real}s"
    end

    desc 'erase all groupings'
    task erase: :environment do
      Utils::Logging.without_sql do
        delete_all
      end
    end
  end
end
