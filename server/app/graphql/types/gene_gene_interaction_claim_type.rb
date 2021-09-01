module Types
    class GeneGeneInteractionClaimType < Types::BaseObject
        field :id, String, null: false, validates: { length: { maximum: 255 } }
        field :gene_id, String, null: false, validates: { length: { maximum: 255 } }
        field :interacting_gene_id, String, null: false, validates: { length: { maximum: 255 } }
        field :source_id, String, null: false, validates: { length: { maximum: 255 } }
    end    
end