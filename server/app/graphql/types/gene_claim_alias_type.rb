module Types
    class GeneClaimAliasType < Types::BaseObject
        field :id, String, null: false
        field :gene_claim_id, String, null: false
        field :alias, String, null: false
        field :nomenclature, String, null: false
    end
end