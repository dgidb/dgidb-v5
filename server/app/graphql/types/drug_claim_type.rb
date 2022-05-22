module Types
  class DrugClaimType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :nomenclature, String, null: false
    field :source_id, ID, null: true
    field :drug_id, ID, null: true
    field :drug, Types::DrugType, null: true
    field :drug_claim_aliases, [Types::DrugClaimAliasType], null: false
    field :interaction_claims, [Types::InteractionClaimType], null: false
    field :gene_claims, [Types::GeneClaimType], null: false
    field :source, Types::SourceType, null: true
    field :drug_claim_attributes, [Types::DrugClaimAttributeType], null: false
    field :drug_claim_approval_ratings, [Types::DrugClaimApprovalRatingType], null: false
    field :drug_claim_types, [Types::DrugClaimTypeType], null: false

    def drug
      Loaders::RecordLoader.for(Drug).load(object.drug_id)
    end

    def drug_claim_aliases
      Loaders::AssociationLoader.for(DrugClaim, :drug_claim_aliases).load(object)
    end

    def interaction_claims
      Loaders::AssociationLoader.for(DrugClaim, :interaction_claims).load(object)
    end

    def gene_claims
      Loaders::AssociationLoader.for(DrugClaim, :gene_claims).load(object)
    end

    def source
      Loaders::RecordLoader.for(Source).load(object.source_id)
    end

    def drug_claim_attributes
      Loaders::AssociationLoader.for(DrugClaim, :drug_claim_attributes).load(object)
    end

    def drug_claim_approval_ratings
      Loaders::AssociationLoader.for(DrugClaim, :drug_claim_approval_ratings).load(object)
    end

    def drug_claim_types
      Loaders::AssociationLoader.for(DrugClaim, :drug_claim_types).load(object)
    end
  end
end
