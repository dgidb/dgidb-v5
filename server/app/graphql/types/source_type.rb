module Types
  class SourceType < Types::BaseObject
  class CategoryWithCount < Types::BaseObject
    field :name, String, null: false
    field :gene_count, Int, null: false
  end
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
    field :license, String, null: true
    field :license_link, String, null: true

    field :gene_claims, [Types::GeneClaimType], null: false
    field :drug_claims, [Types::DrugClaimType], null: false
    field :interaction_claims, [Types::InteractionClaimType], null: false
    field :drug_aliases, [Types::DrugAliasType], null: false
    field :drug_attributes, [Types::DrugAttributeType], null: false
    field :drug_approval_ratings, [Types::DrugApprovalRatingType], null: false
    field :gene_aliases, [Types::GeneAliasType], null: false
    field :gene_attributes, [Types::GeneAttributeType], null: false
    field :interaction_attributes, [Types::InteractionAttributeType], null: false
    field :source_types, [Types::SourceTypeType], null: false
    field :source_trust_level, Types::SourceTrustLevelType, null: true
    field :categories_in_source, [CategoryWithCount], null: false


    def categories_in_source
      GeneClaimCategory.joins(gene_claims: [:source]).where("sources.id =? ", object.id).select("gene_claim_categories.name, count(distinct(gene_claims.id)) AS gene_count").group("gene_claim_categories.name")
    end

    def gene_claims
      Loaders::AssociationLoader.for(Source, :gene_claims).load(object)
    end

    def drug_claims
      Loaders::AssociationLoader.for(Source, :drug_claims).load(object)
    end

    def interaction_claims
      Loaders::AssociationLoader.for(Source, :interaction_claims).load(object)
    end

    def drug_aliases
      Loaders::AssociationLoader.for(Source, :drug_aliases).load(object)
    end

    def drug_attributes
      Loaders::AssociationLoader.for(Source, :drug_attributes).load(object)
    end

    def drug_approval_ratings
      Loaders::AssociationLoader.for(Source, :drug_approval_ratings).load(object)
    end

    def gene_aliases
      Loaders::AssociationLoader.for(Source, :gene_aliases).load(object)
    end

    def gene_attributes
      Loaders::AssociationLoader.for(Source, :gene_attributes).load(object)
    end

    def interaction_attributes
      Loaders::AssociationLoader.for(Source, :interaction_attributes).load(object)
    end

    def source_types
      Loaders::AssociationLoader.for(Source, :source_types).load(object)
    end

    def source_trust_level
      Loaders::RecordLoader.for(SourceTrustLevel).load(object.source_trust_level_id)
    end
  end
end
