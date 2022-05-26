module Types
  class DrugClaimApprovalRatingType < Types::BaseObject
    field :id, ID, null: false
    field :drug_claim_id, ID, null: false
    field :rating, String, null: false

    field :drug_claim, Types::DrugClaimType, null: false

    def drug_claim
      Loaders::RecordLoader.for(DrugClaim).load(object.drug_claim_id)
    end
  end
end

