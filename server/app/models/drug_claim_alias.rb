class DrugClaimAlias < ::ActiveRecord::Base
  include Genome::Extensions::UUIDPrimaryKey
  belongs_to :drug_claim, inverse_of: :drug_claim_aliases

  def self.for_search
    eager_load(
      drug_claim: [
        drug: [
          drug_claims: {
            interaction_claims: {
              source: [],
              gene_claim: %i[source gene_claim_categories],
              interaction_claim_types: [],
              drug_claim: [
                drug: [
                  drug_claims: []
                ]
              ]
            }
          }
        ]
      ]
    )
  end
end
