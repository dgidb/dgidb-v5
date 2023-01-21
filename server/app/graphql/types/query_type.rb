module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    include Types::Queries::GeneLookupQuery

    field :genes, resolver: Resolvers::Genes
    field :drugs, resolver: Resolvers::Drugs
    field :sources, resolver: Resolvers::Sources
    field :categories, resolver: Resolvers::Categories


    field :source, Types::SourceType, null: true do
      description "A source"
      argument :id, String, required: true
    end

    def source(id:)
      Source.find_by(id: id)
    end

    field :source_trust_level, Types::SourceTrustLevelType, null: true do
      description "Trust level for a source"
      argument :id, ID, required: true
    end

    def source_trust_level(id:)
      SourceTrustLevel.find_by(id: id)
    end

    field :source_type, Types::SourceTypeType, null: true do
      description "Types of sources"
      argument :id, ID, required: true
    end

    def source_type(id:)
      ::SourceType.find_by(id: id)
    end

    field :gene_claim, Types::GeneClaimType, null: true do
      description "A claim for a gene"
      argument :id, String, required: true
    end

    def gene_claim(id:)
      GeneClaim.find_by(id: id)
    end

    field :gene, Types::GeneType, null: true do
      description "A gene"
      argument :name, String, required: true
    end

    def gene(name: )
      Gene.find_by(name: name)
    end

    field :gene_alias, Types::GeneAliasType, null: true do
      description "Alias for a gene"
      argument :id, String, required: true
    end

    def gene_alias(id: )
      GeneAlias.find_by(id: id)
    end

    field :gene_attribute, Types::GeneAttributeType, null: true do
      description "Attribute for a gene"
      argument :id, String, required: true
    end

    def gene_attribute(id: )
      GeneAttribute.find_by(id: id)
    end

    field :gene_claim_attribute, Types::GeneClaimAttributeType, null: true do
      description "Attribute for a gene claim"
      argument :id, String, required: true
    end

    def gene_claim_attribute(id: )
      GeneClaimAttribute.find_by(id: id)
    end

    field :gene_claim_alias, Types::GeneClaimAliasType, null: true do
      description "Alias for a gene claim"
      argument :id, String, required: true
    end

    def gene_claim_alias(id: )
      GeneClaimAlias.find_by(id: id)
    end

    field :gene_claim_category, Types::GeneClaimCategoryType, null: true do
      description "Category for a gene claim"
      argument :name, String, required: true
    end

    def gene_claim_category(name: )
      GeneClaimCategory.find_by(name: name)
    end

    field :drug_alias, Types::DrugAliasType, null: true do
      description "Alias for a drug"
      argument :id, String, required: true
    end

    def drug_alias(id:)
      DrugAlias.find_by(id: id)
    end

    field :drug_attribute, Types::DrugAttributeType, null: true do
      description "Attribute(s) associated with with a drug"
      argument :id, ID, required: true
    end

    def drug_attribute(id:)
      DrugAttribute.find_by(id: id)
    end

    field :drug_claim_alias, Types::DrugClaimAliasType, null: true do
      description "Alias for a drug claim"
      argument :id, ID, required: true
    end

    def drug_claim_alias(id:)
      DrugClaimAlias.find_by(id: id)
    end

    field :drug_claim_attribute, Types::DrugClaimAttributeType, null: true do
      description "Attributes for a claim on a drug"
      argument :id, ID, required: true
    end

    def drug_claim_attribute(id:)
      DrugClaimAttribute.find_by(id: id)
    end

    field :drug_claim, Types::DrugClaimType, null: true do
      description "A claim for a drug"
      argument :id, ID, required: true
    end

    def drug_claim(id:)
      DrugClaim.find_by(id: id)
    end

    field :drug_application, Types::DrugApplicationType, null: true do
      description "Drug application"
      argument :id, ID, required: true
    end

    def drug_application(id:)
      DrugApplication.find_by(id: id)
    end

    field :drug_approval_rating, Types::DrugApprovalRatingType, null: true do
      description "Drug approval rating"
      argument :id, ID, required: true
    end

    def drug_approval_rating(id:)
      DrugApprovalRating.find_by(id: id)
    end

    field :drug, Types::DrugType, null: true do
      description "A drug"
      argument :name, String, required: true
    end

    def drug(name: )
      Drug.find_by(name: name)
    end

    field :interaction_attribute, Types::InteractionAttributeType, null: true do
      description "An attribute of an interaction"
      argument :id, ID, required: true
    end

    def interaction_attribute(id:)
      InteractionAttribute.find_by(id: id)
    end

    field :interaction_claim_attribute, Types::InteractionClaimAttributeType, null: true do
      description "An attribute of an interaction claim"
      argument :id, ID, required: true
    end

    def interaction_claim_attribute(id:)
      InteractionClaimAttribute.find_by(id: id)
    end

    field :interaction_claim_link, Types::InteractionClaimLinkType, null: true do
      description "Links associated with an attribute claim"
      argument :id, ID, required: true
    end

    def interaction_claim_link(id:)
      InteractionClaimLink.find_by(id: id)
    end

    field :interaction_claim_type, Types::InteractionClaimTypeType, null: true do
      description "A type associated with an interaction claim"
      argument :id, ID, required: true
    end

    def interaction_claim_type(id:)
      ::InteractionClaimType.find id
    end

    field :interaction_claim, Types::InteractionClaimType, null: true do
      description "A claim on an interaction"
      argument :id, ID, required: true
    end

    def interaction_claim(id:)
      InteractionClaim.find_by(id: id)
    end

    field :interaction, Types::InteractionType, null: true do
      description "An interaction"
      argument :id, ID, required: true
    end

    def interaction(id:)
      Interaction.find_by(id: id)
    end

    field :publication, Types::PublicationType, null: true do
      description "A publication"
      argument :id, ID, required: true
    end

    def publication(id:)
      Publication.find_by(id: id)
    end
  end
end
