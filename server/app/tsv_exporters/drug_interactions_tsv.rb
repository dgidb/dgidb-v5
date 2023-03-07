class DrugInteractionsTsv
  def self.table_headers
    [
      'drug',
      'gene',
      'regulatory approval',
      'interaction score'
    ]
  end

  def self.to_row(object: )
    object.interactions.includes(:gene).map do |i|
      [
        object.name,
        i.gene.name,
        object.approved ? 'Approved' : 'Not Approved',
        i.interaction_score
      ]
    end
  end
end
