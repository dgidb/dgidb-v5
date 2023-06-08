module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    include Types::Queries::GeneLookupQuery
    include Types::Queries::DrugLookupQuery

    field :genes, resolver: Resolvers::Genes
    field :drugs, resolver: Resolvers::Drugs
    field :drug_claims, resolver: Resolvers::DrugClaims
    field :sources, resolver: Resolvers::Sources
    field :categories, resolver: Resolvers::Categories
    field :interaction_claim_types, resolver: Resolvers::InteractionClaimTypes

    field :drug_suggestions, [Types::DrugSuggestionType], null: true do
      description "A searchable drug name or alias that can be completed from the supplied term"
      argument :term, String, required: true
      argument :n, Int, required: false
    end


    def drug_suggestions(term:, n: 10)
      matches = Drug.where("drugs.name ILIKE ?", "#{term}%").limit(n).map do |drug|
        {
          drug_name: drug.name,
          concept_id: drug.concept_id,
          suggestion: drug.name,
          suggestion_type: 'NAME'
        }
      end
      matches = matches.uniq { |d| d[:suggestion] }

      if matches.length < n
        matches += DrugAlias.includes(:drug)
          .where("drug_aliases.alias ILIKE ?", "#{term}%")
          .limit(n - matches.length)
          .map do |drug_alias|
          {
            drug_name: drug_alias.drug.name,
            concept_id: drug_alias.drug.concept_id,
            suggestion: drug_alias.alias,
            suggestion_type: 'ALIAS'
          }
        end
      end
      matches = matches.uniq { |d| d[:suggestion] }

      if matches.length < n
        matches += Drug.where("drugs.concept_id ILIKE ?", "#{term}%").limit(n).map do |drug|
          {
            drug_name: drug.name,
            concept_id: drug.concept_id,
            suggestion: drug.concept_id,
            suggestion_type: 'CONCEPT_ID'
          }
        end
      end

      return matches.uniq { |d| d[:suggestion] }
    end

    field :gene_suggestions, [Types::GeneSuggestionType], null: true do
      description "A searchable gene name or alias that can be completed from the supplied term"
      argument :term, String, required: true
      argument :n, Int, required: false
    end

    def gene_suggestions(term:, n: 10)
      matches = Gene.where("genes.name ILIKE ?", "#{term}%").limit(n).map do |gene|
        {
          gene_name: gene.name,
          concept_id: gene.concept_id,
          suggestion: gene.name,
          suggestion_type: 'NAME'
        }
      end
      matches = matches.uniq { |g| g[:suggestion] }

      if matches.length < n
        matches += GeneAlias.includes(:gene)
          .where("gene_aliases.alias ILIKE ?", "#{term}%")
          .limit(n - matches.length)
          .map do |gene_alias|
          {
            gene_name: gene_alias.gene.name,
            concept_id: gene_alias.gene.concept_id,
            suggestion: gene_alias.alias,
            suggestion_type: 'ALIAS'
          }
        end
      end
      matches = matches.uniq { |g| g[:suggestion] }

      if matches.length < n
        matches += Gene.where("genes.concept_id ILIKE ?", "#{term}%").limit(n).map do |gene|
          {
            gene_name: gene.name,
            concept_id: gene.concept_id,
            suggestion: gene.concept_id,
            suggestion_type: 'CONCEPT_ID'
          }
        end
      end

      return matches.uniq { |g| g[:suggestion] }
    end

    field :source, Types::SourceType, null: true do
      description "A source"
      argument :id, String, required: false
      argument :name, String, required: false
    end

    # TODO double check sql equality operators
    def source(id: nil, name: nil)
      if name && id
        Source.find_by("id = ? AND lower(source_db_name) LIKE ?", id, name.downcase)
      elsif name
        Source.find_by("lower(source_db_name) = ?", name.downcase)
      elsif id
        Source.find_by(id: id)
      end
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
      SourceType.find_by(id: id)
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
      argument :concept_id, String, required: true
    end

    def gene(concept_id: )
      Gene.find_by(concept_id: concept_id)
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
      context.scoped_set!(:category_name, name)
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
      argument :concept_id, String, required: true
    end

    def drug(concept_id: )
      Drug.find_by(concept_id: concept_id)
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
