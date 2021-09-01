module Types
    class GeneClaimCategoryType < Types::Base
        field :id, String, null: false, validates: { length: { maximum: 255 } }
        field :name, String, null: false, validates: { length: { maximum: 255 } }
    end
end