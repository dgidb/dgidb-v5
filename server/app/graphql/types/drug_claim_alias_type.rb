module Types
  class DrugClaimAliasType < Types::BaseObject
    field :id, ID, null: false
    field :drug_claim_id, ID, null: false
    field :alias, String, null: false, resolver_method: :resolve_alias
    field :nomenclature, String, null: false
    field :drug_claim, Types::DrugClaimType, null: false

    def drug_claim
      Loaders::RecordLoader.for(DrugClaim).load(object.drug_claim_id)
    end

    def resolve_alias
      object.alias
    end
  end
end
