require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Genes < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::GeneType.connection_type, null: false

  scope { Gene.all }

  option(:ids, type: [String]) { |scope, value| scope.where(id: value)}
  option(:names, type: [String]) { |scope, value| scope.where(name: value) }
  option(:long_name, type: String) { |scope, value| scope.where("long_name ILIKE?", "#{value}%")}
  option(:concept_id, type: Int) { |scope, value| scope.where(concept_id: value)}

  # TODO: search filters (Clinically Actionable, Druggable Genome, Drug Resistance)

  # gene claim catagory by name
  option(:gene_claim_catagory, type: [String], description: "Filtering on gene claim catagory name.") do |scope, values|
    scope.joins(gene_claims: :gene_claim_categories).where('gene_claim_categories.name IN (?)', values)
  end

  option(:interaction_type, type: String, description: 'Exact filtering on interaction claim type.') do |scope, value|
    scope.joins(interactions: :interaction_types).where("interaction_claim_types.type = ?", value)
  end

  option(:source_name, type: String, description: 'Exact filtering on full name of source for an interaction.') do |scope, value|
    scope.joins(interactions: :sources).where("sources.full_name ILIKE ?", "%#{value}%")
  end

  option(:source_db_name, type: String, description: 'Exact filtering of source db name for an interaction') do |scope, value|
    scope.joins(interactions: :sources).where("sources.source_db_name ILIKE ?", "%#{value}%")
  end

  option(:pmid, type: Int, description: 'Exact match filtering on publication pmids.') do |scope, value|
    scope.joins(interactions: :publications).where("publications.pmid = ?", value)
  end

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
