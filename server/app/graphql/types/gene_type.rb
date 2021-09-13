module Types
  class GeneType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: true
    field :long_name, String, null: true
    field :entrez_id, Int, null: true
  end
end
