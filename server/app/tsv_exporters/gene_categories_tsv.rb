class GeneCategoriesTsv
  def self.table_headers
    [
      'gene',
      'category',
      'sources'
    ]
  end

  def self.to_row(object: )
    object.gene_categories_with_sources.map do |c|
      [
        object.name,
        c.name,
        c.source_names.join(',')
      ]
    end
  end
end
