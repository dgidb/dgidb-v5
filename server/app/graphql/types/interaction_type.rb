module Types
  class InteractionType < Types::BaseObject
    field :id, ID, null: false
    field :drug_id, ID, null: false
    field :gene_id, ID, null: false

    field :interaction_claims, [Types::InteractionClaimType], null: true
    field :gene, Types::GeneType, null: false
    field :drug, Types::DrugType, null: false
    field :interaction_types, [Types::InteractionClaimTypeType], null: true
    field :interaction_attributes, [Types::InteractionAttributeType], null: true
    field :publications, [Types::PublicationType], null: true
    field :sources, [Types::SourceType], null: true

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
