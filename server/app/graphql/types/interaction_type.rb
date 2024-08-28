module Types
  class InteractionType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :gene_id, ID, null: false

    field :interaction_claims, [Types::InteractionClaimType], null: false
    field :gene, Types::GeneType, null: false
    field :drug, Types::DrugType, null: false
    field :interaction_types, [Types::InteractionClaimTypeType], null: false
    field :interaction_attributes, [Types::InteractionAttributeType], null: false
    field :publications, [Types::PublicationType], null: false
    field :sources, [Types::SourceType], null: false
    field :interaction_score, Float, null: false
    field :drug_specificity, Float, null: false
    field :gene_specificity, Float, null: false
    field :evidence_score, Integer, null: false

    def interaction_claims
      Loaders::AssociationLoader.for(Interaction, :interaction_claims).load(object)
    end

    def gene
      Loaders::RecordLoader.for(Gene).load(object.gene_id)
    end

    def drug
      Loaders::RecordLoader.for(Drug).load(object.drug_id)
    end

    def interaction_types
      Loaders::AssociationLoader.for(Interaction, :interaction_types).load(object)
    end

    def interaction_attributes
      Loaders::AssociationLoader.for(Interaction, :interaction_attributes).load(object)
    end

    def publications
      Loaders::AssociationLoader.for(Interaction, :publications).load(object)
    end

    def sources
      Loaders::AssociationLoader.for(Interaction, :sources).load(object)
    end
  end
end
