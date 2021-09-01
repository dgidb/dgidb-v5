module Types
    class GeneGeneInteractionClaimAttributeType < Types::BaseObject
        field :id, String, null: false, validates: { length: { maximum: 255 } }
        field :gene_gene_interaction_claim_id, String, null: false, validates: { length: { maximum: 255 } }
        field :name, String, null: false, validates: { length: { maximum: 255 } }
        field :value, String, null: false, validates: { length: { maximum: 255 } }
    end    
end