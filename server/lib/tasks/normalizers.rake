namespace :dgidb do
  namespace :normalize do
    desc 'normalize drug claim types up into table from hangoff properties'
    task drug_types: :environment do
      Genome::Normalizers::DrugTypeNormalizer.normalize_types
    end

    desc 'initially populate counter cache columns for sources'
    task populate_source_counters: :environment do
      Genome::Normalizers::PopulateCounters.populate_source_counters
    end

    desc 'normalize drug approval rating values'
    task drug_approval_ratings: :environment do
      Genome::Normalizers::DrugApprovalRatingNormalizer.normalize_approval_ratings
    end
  end
end
