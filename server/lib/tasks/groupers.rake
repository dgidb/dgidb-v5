namespace :dgidb do
  namespace :group do
    def delete_interactions
      InteractionClaim.update_all('interaction_id = NULL')
      InteractionClaimType.all.each do |ict|
        ict.interactions = []
      end
      Publication.all.each do |p|
        p.interactions = []
      end
      Interaction.all.each do |i|
        i.publications = []
        i.interaction_types = []
        i.sources = []
      end
      InteractionAttribute.delete_all
      Interaction.delete_all
    end

    def delete_drugs
      DrugClaim.update_all('drug_id = NULL')
      Drug.delete_all
    end

    def delete_genes
      GeneClaim.update_all('gene_id = NULL')
      GeneClaimCategory.all.each do |gcg|
        gcg.genes = []
      end
      GeneAlias.delete_all
      GeneAttribute.delete_all
      Gene.delete_all
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
        Genome::Groupers::DrugGrouper.run
      end
    end
    desc 'run the interaction grouper'
    task interactions: :environment do
      Utils::Logging.without_sql do
        Genome::Groupers::InteractionGrouper.run
      end
    end
    desc 'erase all groupings'
    task erase_groups: :environment do
      Utils::Logging.without_sql do
        # clear source data
        Source.all.each do |s|
          s.interaction_attributes = []
          s.gene_aliases = []
          s.gene_attributes = []
        end

        delete_interactions
        delete_drugs
        delete_genes
      end
    end
  end
end
