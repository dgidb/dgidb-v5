module Types
    class GeneType < Types::BaseObject
        field :id, String, null: false
        field :name, String, null: true
        field :long_name, String, null: true #, validates: { length: { maximum: 255 } }
        field :entrez_id, Int, null: true
    end
end