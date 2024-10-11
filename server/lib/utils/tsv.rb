require 'csv'

module Utils
  module TSV

    def self.add_tsv_header(tsv)
      tsv << ["# Update date: #{Date.today.strftime('%Y-%b-%d')}"]
      tsv << ["# DGIdb version: #{GithubRelease.current&.dig('tag_name')}"]
    end

    def self.generate_interactions_tsv
      outfile_path = Rails.root.join('data', "interactions_#{Date.today.iso8601}.tsv")
      CSV.open(outfile_path, 'wb', col_sep: "\t") do |tsv|
        add_tsv_header(tsv)
        tsv << %w[
          gene_claim_name
          gene_concept_id
          gene_name

          drug_claim_name
          drug_concept_id
          drug_name
          drug_is_approved
          drug_is_immunotherapy
          drug_is_antineoplastic

          interaction_source_db_name
          interaction_source_db_version
          interaction_types
          interaction_score
          drug_specificity_score
          gene_specificity_score
          evidence_score
        ]

        select_statement = <<~SQL
          gene_claims.name AS gene_claim_name,
          genes.concept_id AS gene_concept_id,
          genes.name AS gene_name,
          drug_claims.name AS drug_claim_name,
          drugs.concept_id AS drug_concept_id,
          drugs.name AS drug_name,
          drugs.approved AS drug_is_approved,
          drugs.immunotherapy AS drug_is_immunotherapy,
          drugs.anti_neoplastic AS drug_is_antineoplastic,
          sources.source_db_name AS interaction_source_db_name,
          sources.source_db_version AS interaction_source_db_version,
          ARRAY_AGG(interaction_claim_types.type) AS int_types,
          interactions.score AS interaction_score,
          interactions.drug_specificity AS drug_specificity_score,
          interactions.gene_specificity AS gene_specificity_score,
          interactions.evidence_score AS evidence_score
        SQL

        InteractionClaim.left_outer_joins(
          :interaction_claim_types,
          :gene_claim, :drug_claim,
          :source,
          :interaction
        ).left_outer_joins(
          drug_claim: :drug,
          gene_claim: :gene
        ).select(
          select_statement
        ).group(
          "gene_claims.id, drug_claims.id, interaction_claims.id, drugs.id, genes.id, interactions.id, sources.id"
        ).map do |row|
          tsv << [
            row.gene_claim_name,
            row.gene_concept_id,
            row.gene_name,
            row.drug_claim_name,
            row.drug_concept_id,
            row.drug_name,
            row.drug_is_approved,
            row.drug_is_immunotherapy,
            row.drug_is_antineoplastic,
            row.interaction_source_db_name,
            row.interaction_source_db_version,
            row.int_types.join('|'),
            row.interaction_score,
            row.drug_specificity_score,
            row.gene_specificity_score,
            row.evidence_score
          ]
        end
      end
    end

    def self.generate_categories_tsv
      outfile_path = Rails.root.join('data', "categories_#{Date.today.iso8601}.tsv")
      CSV.open(outfile_path, 'wb', col_sep: "\t") do |tsv|
        add_tsv_header(tsv)
        tsv << %w[
          gene_claim_name
          gene_category_name
          source_db_name
          source_db_version
        ]

        select_statement = <<~SQL
          gene_claims.name AS gene_claim_name,
          gene_claim_categories.name AS gene_category_name,
          sources.source_db_name AS source_name,
          sources.source_db_version AS source_version
        SQL

        GeneClaim.joins(:gene_claim_categories, :source).select(select_statement).map do |row|
          tsv << [
            row.gene_claim_name,
            row.gene_category_name,
            row.source_name,
            row.source_version
          ]
        end
      end
    end

    def self.generate_genes_tsv
      outfile_path = Rails.root.join('data', "genes_#{Date.today.iso8601}.tsv")
      CSV.open(outfile_path, 'wb', col_sep: "\t") do |tsv|
        add_tsv_header(tsv)
        tsv << %w[
          gene_claim_name
          nomenclature
          concept_id
          gene_name
          source_db_name
          source_db_version
        ]
        select_statement = <<~SQL
          gene_claims.name AS gene_claim_name,
          gene_claims.nomenclature AS nomenclature,
          genes.concept_id AS concept_id,
          genes.name AS gene_name,
          sources.source_db_name AS source_name,
          sources.source_db_version AS source_version
        SQL

        GeneClaim.joins(:gene, :source).select(select_statement).map do |row|
          tsv << [
            row.gene_claim_name,
            row.nomenclature,
            row.concept_id,
            row.gene_name,
            row.source_name,
            row.source_version
          ]
        end
      end
    end

    def self.generate_drugs_tsv
      outfile_path = Rails.root.join('data', "drugs_#{Date.today.iso8601}.tsv")
      CSV.open(outfile_path, 'wb', col_sep: "\t") do |tsv|
        add_tsv_header(tsv)
        tsv << %w[
          drug_claim_name
          nomenclature
          concept_id
          drug_name
          approved
          immunotherapy
          anti_neoplastic
          source_db_name
          source_db_version
        ]
        select_statement = <<~SQL
          drug_claims.name AS drug_claim_name,
          drug_claims.nomenclature AS nomenclature,
          drugs.concept_id AS concept_id,
          drugs.name AS drug_name,
          drugs.approved AS drug_is_approved,
          drugs.immunotherapy AS drug_is_immunotherapy,
          drugs.anti_neoplastic AS drug_is_antineoplastic,
          sources.source_db_name AS source_name,
          sources.source_db_version AS source_version
        SQL

        DrugClaim.joins(:drug, :source).select(select_statement).map do |row|
          tsv << [
            row.drug_claim_name,
            row.nomenclature,
            row.concept_id,
            row.drug_name,
            row.drug_is_approved,
            row.drug_is_immunotherapy,
            row.drug_is_antineoplastic,
            row.source_name,
            row.source_version
          ]
        end
      end
    end
  end
end
