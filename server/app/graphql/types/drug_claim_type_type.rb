module Types
  class DrugClaimTypeType < Types::BaseObject
    field :id, ID, null: false
    field :type, String, null: false
    field :drug_claims, [Types::DrugClaimType], null: false

    def drug_claims
      Loaders::AssociationLoader.for(::DrugClaimType, :drug_claims).load(object)
    end
  end
end
