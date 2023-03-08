module Types
  class DrugApplicationType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :app_no, String, null: false
    field :drug, Types::DrugType, null: false

    def drug
      Loaders::RecordLoader.for(Drug).load(object.drug_id)
    end
  end
end

