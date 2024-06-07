require 'search_object'
require 'search_object/plugin/graphql'

class Resolvers::Interactions < GraphQL::Schema::Resolver
  include SearchObject.module(:graphql)

  type Types::InteractionType.connection_type, null: true

  scope { Interaction.all }

  option(:drug_names, type: [String], description: 'Filters interactions to only include those involving any of the specified drug names. This field accepts a list of drug names, which are case-insensitive, and returns interactions where the associated drug\'s name matches any name in the provided list.') do |scope, value|
    if drug_names.nil? || drug_names.length == 0
      scope
    else
      names = value.map { |v| v.upcase }
      scope.joins(:drug).where(drugs: {name: names})
    end
  end

  option(:gene_names, type: [String], description: 'Filters interactions to only include those involving any of the specified gene names. This field accepts a list of gene names, which are case-insensitive, and returns interactions where the gene\'s name matches any name in the provided list.') do |scope, value|
    if gene_names.nil? || gene_names.length == 0
      scope
    else
      names = value.map { |v| v.upcase }
      scope.joins(:gene).where(genes: {name: names})
    end
  end

  option(:drug_concept_ids, type: [String], description: 'Filters interactions to only include those involving any of the specified drug concept IDs. This field accepts a list of drug concept IDs, which are case-insensitive, and returns interactions where the associated drug\'s concept ID matches any ID in the provided list.') do |scope, value|
    if drug_concept_ids.nil? || drug_concept_ids.length == 0
      scope
    else
      concept_ids = value.map { |v| v.upcase }
      scope.joins(:drug).where(drugs: {concept_id: concept_ids})
    end
  end

  option(:gene_concept_ids, type: [String], description: 'Filters interactions to only include those involving any of the specified gene concept IDs. This field accepts a list of gene concept IDs, which are case-insensitive, and returns interactions where the associated gene\'s concept ID matches any ID in the provided list.') do |scope, value|
    if gene_concept_ids.nil? || gene_concept_ids.length == 0
      scope
    else
      concept_ids = value.map { |v| v.upcase }
      scope.joins(:gene).where(genes: {concept_id: concept_ids})
    end
  end

  option(:approved, type: Boolean, description: 'Filters interactions to include only those involving drugs with the specified approval status. Setting this to `true` returns interactions associated with approved drugs, while `false` returns interactions with drugs that are not known to be approved') do |scope, value|
    scope.joins(:drug).where(drugs: {approved: value})
  end

  option(:immunotherapy, type: Boolean, description: 'Filters interactions based on whether the involved drugs are classified as immunotherapies. Set this to `true` to retrieve interactions involving immunotherapy drugs, or `false` to retrieve interactions involving non-immunotherapeutics') do |scope, value|
    scope.joins(:drug).where(drugs: {immunotherapy: value})
  end

  option(:anti_neoplastic, type: Boolean, description: 'Filters interactions based on whether the involved drugs are classified as antineoplastics. Use `true` to include interactions involving antineoplastic drugs, or `false` to include those involving non-antineoplastic drugs') do |scope, value|
    scope.joins(:drug).where(drugs: {anti_neoplastic: value})
  end

  option(:sources, type: [String], description: 'Filters interactions to include only those provided by the specified sources. This filter accepts a list of source names and returns interactions that have at least one matching source in the list') do |scope, value|
    scope.joins(:sources).where(sources: {source_db_name: value})
  end
end
