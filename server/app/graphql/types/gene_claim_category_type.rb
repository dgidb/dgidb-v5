module Types
  class GeneClaimCategoryType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false

    field :gene_claims, [Types::GeneClaimType], null: false
    field :genes, [Types::GeneType], null: false

    def gene_claims
      Loaders::AssociationLoader.for(GeneClaimCategory, :gene_claims).load(object)
    end

    def genes
      Loaders::AssociationLoader.for(GeneClaimCategory, :genes).load(object)
    end
  end
end
