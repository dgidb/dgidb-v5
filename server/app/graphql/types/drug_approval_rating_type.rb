module Types
  class DrugApprovalRatingType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :rating, String, null: false
    field :drug, Types::DrugType, null: false
    field :sources, [Types::SourceType], null: false

    def drug
      Loaders::RecordLoader.for(Drug).load(object.drug_id)
    end

    def sources
      Loaders::AssociationLoader.for(DrugApprovalRating, :sources).load(object)
    end
  end
end

