class CountsController < ApplicationController
  def index
    counts = Rails.cache.fetch('api_counts', expires_in: 24.hours) do
      {
        drug_claims: DrugClaim.count,
        drugs: Drug.count,
        gene_claims: GeneClaim.count,
        genes: Gene.count,
        interaction_claims: InteractionClaim.count,
        interactions: Interaction.count,
        gene_categorization_claims: GeneClaimCategory.joins(:gene_claims).count,
        gene_categorizations: GeneClaimCategory.joins(:genes).count,
        sources: Source.count,
        publications: Publication.count
      }
    end

    render json: counts
  end
end
