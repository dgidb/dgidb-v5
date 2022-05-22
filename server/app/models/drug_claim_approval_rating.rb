class DrugClaimApprovalRating < ::ActiveRecord::Base
  include Genome::Extensions::UUIDPrimaryKey
  belongs_to :drug_claim, inverse_of: :drug_claim_approval_ratings
end
