class GeneInteractionsTsv
  def self.table_headers
    [
      'gene',
      'drug',
      'regulatory approval',
      'indication',
      'interaction score'
    ]
  end

  def self.to_row(object: )
    object.interactions.includes(drug: [:drug_attributes]).map do |i|
      [
        object.name,
        i.drug.name,
        i.drug.approved ? 'Approved' : 'Not Approved',
        i.drug.drug_attributes
          .select { |da| da.name == 'Drug Indications' }
          .map(&:value)
          .join(','),
        i.interaction_score
      ]
    end
  end
end
