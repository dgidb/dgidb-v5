namespace :dgidb do
  namespace :generate do
    desc 'generate a complete interactions TSV file'
    task interactions_tsv: :environment do
      Utils::TSV.generate_interactions_tsv
    end

    desc 'generate a complete druggable categories TSV file'
    task categories_tsv: :environment do
      Utils::TSV.generate_categories_tsv
    end

    desc 'generate a complete gene claims TSV file'
    task genes_tsv: :environment do
      Utils::TSV.generate_genes_tsv
    end

    desc 'generate a complete drug claims TSV file'
    task drugs_tsv: :environment do
      Utils::TSV.generate_drugs_tsv
    end
  end
end
