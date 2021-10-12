module Types
  class GeneType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :long_name, String, null: true
    field :entrez_id, Int, null: true

    field :gene_claims, [Types::GeneClaimType], null: false
    field :gene_gene_interaction_claims, [Types::GeneGeneInteractionClaimType], null: false
    field :interactions, [Types::InteractionType], null: false
    field :gene_aliases, [Types::GeneAliasType], null: false
    field :gene_attributes, [Types::GeneAttributeType], null: false
    field :gene_categories, [Types::GeneClaimCategoryType], null: false
  end
end
