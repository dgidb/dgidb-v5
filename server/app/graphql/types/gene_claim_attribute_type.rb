module Types
    class GeneClaimAttributeType < Types::BaseObject
        field :id, String, null: false
        field :gene_claim_id, String, null: false
        field :name, String, null: false
        field :value, String, null: false
    end
end