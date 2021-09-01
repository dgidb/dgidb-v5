module Types
    class GeneAttributeType < Types::BaseObject
        field :id, String, null: false
        field :gene_id, String, null: false
        field :name, String, null: false
        field :value, String, null: false
    end
end