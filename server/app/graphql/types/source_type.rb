module Types
  class SourceType < Types::BaseObject
    field :id, String, null: false
    field :source_db_name, String, null: false
    field :source_db_version, String, null: false
    field :citation, String, null: true
    field :base_url, String, null: true
    field :site_url, String, null: true
    field :full_name, String, null: true
    field :gene_claims_count, Int, null: true
    field :drug_claims_count, Int, null: true
    field :interaction_claims_count, Int, null: true
    field :interaction_claims_in_groups_count, Int, null: true
    field :gene_claims_in_groups_count, Int, null: true
    field :drug_claims_in_groups_count, Int, null: true
    field :source_trust_level_id, String, null: true 
    field :gene_gene_interaction_claims_count, Int, null: true
    field :license, String, null: true
    field :license_link, String, null: true
    
    field :gene_claims, [Types::GeneClaimType], null: true
    field :drug_claims, [Types::DrugClaimType], null: true
    field :interaction_claims, [Types::InteractionClaimType], null: true
    field :gene_gene_interaction_claims, [Types::GeneGeneInteractionClaimType], null: true
    field :drug_aliases, [Types::DrugAliasType], null: true
    field :drug_attributes, [Types::DrugAttributeType], null: true
    field :gene_aliases, [Types::GeneAliasType], null: true
    field :gene_attributes, [Types::GeneAttributeType], null: true
    field :interaction_attributes, [Types::InteractionAttributeType], null: true
    field :source_types, [Types::SourceTypeType], null: true
    field :source_trust_level, Types::SourceTrustLevelType, null: true
  end
end
