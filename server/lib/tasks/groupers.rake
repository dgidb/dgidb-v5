namespace :dgidb do
  namespace :group do
    def delete_all
      Utils::Database.delete_interactions
      Utils::Database.delete_genes
      Utils::Database.delete_drugs
    end

    desc 'run the gene grouper'
    task genes: :environment do
      Utils::Logging.without_sql do
        Genome::Groupers::GeneGrouper.run
      end
    end

    desc 'run the drug grouper'
    task drugs: :environment do
      Utils::Logging.without_sql do
        # TODO: remove the delete call -- for dev purposes only
        delete_all
        Genome::Groupers::DrugGrouper.new.run
      end
    end

    desc 'run the interaction grouper'
    task interactions: :environment do
      Utils::Logging.without_sql do
        Genome::Groupers::InteractionGrouper.run
      end
    end

    desc 'erase all groupings'
    task erase: :environment do
      Utils::Logging.without_sql do
        delete_all
      end
    end
  end
end
