module Types
  class DrugApprovalRatingType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :rating, String, null: false
    field :drug, Types::DrugType, null: false
    field :source, Types::SourceType, null: false

    def drug
      Loaders::RecordLoader.for(Drug).load(object.drug_id)
    end

    def source
      Loaders::RecordLoader.for(Source).load(object.source_id)
    end
  end
end

