module Types
  class GeneType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :long_name, String, null: true
    field :entrez_id, Int, null: true

    field :gene_claims, [Types::GeneClaimType], null: true
    field :gene_gene_interaction_claims, [Types::GeneGeneInteractionClaimType], null: true
    field :interactions, [Types::InteractionType], null: true
    field :gene_aliases, [Types::GeneAliasType], null: true
    field :gene_attributes, [Types::GeneAttributeType], null: true
    field :gene_categories, [Types::GeneClaimCategoryType], null: false
  end
end
