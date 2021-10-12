module Types
  class GeneClaimCategoryType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false

    field :gene_claims, [Types::GeneClaimType], null: false
    field :genes, [Types::GeneType], null: false
  end
end
