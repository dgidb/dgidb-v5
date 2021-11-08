module Types
  class GeneClaimAttributeType < Types::BaseObject
    field :id, ID, null: false
    field :gene_claim_id, ID, null: false
    field :name, String, null: false
    field :value, String, null: false

    field :gene_claim, Types::GeneClaimType, null: false

    def gene_claim
      Loaders::RecordLoader.for(GeneClaim).load(object.gene_claim_id)
    end
  end
end
