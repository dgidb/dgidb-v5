module Types
  class GeneClaimAliasType < Types::BaseObject
    field :id, ID, null: false
    field :gene_claim_id, ID, null: false
    field :alias, String, null: false, resolver_method: :resolve_alias
    field :nomenclature, String, null: false

    field :gene_claim, Types::GeneClaimType, null: false

    def resolve_alias
      object.alias
    end

    def gene_claim
      Loaders::RecordLoader.for(GeneClaim).load(object.gene_claim_id)
    end
  end
end
