class Interaction < ActiveRecord::Base
  include Genome::Extensions::UUIDPrimaryKey

  has_many :interaction_claims
  belongs_to :gene
  belongs_to :drug
  has_and_belongs_to_many :interaction_types, join_table: 'interaction_types_interactions',
                                              class_name: 'InteractionClaimType'
  has_many :interaction_attributes
  has_and_belongs_to_many :publications
  has_and_belongs_to_many :sources

  def source_names
    self.sources.pluck(:source_db_name).uniq
  end

  def type_names
    self.interaction_types.pluck(:type).uniq
  end

  def pmids
    self.publications.pluck(:pmid).uniq
  end

  def directionality
    if self.interaction_types.loaded?
      self.interaction_types
          .reject { |it| it.directionality.nil? }
          .map { |it| it.directionality }
          .uniq
    else
      self.interaction_types.where.not(directionality: nil).distinct.pluck(:directionality)
    end
  end

  def self.for_tsv
    eager_load(:gene, :drug, :interaction_types, :sources)
  end

  def self.for_show
    eager_load(:gene, :drug, :interaction_types, :interaction_attributes, :publications, interaction_claims: [:drug_claim, :gene_claim, :interaction_claim_types, :interaction_claim_attributes, :publications, :interaction_claim_links, source: [:source_types]])
  end

  def interaction_score(known_drug_partners_per_gene = nil, known_gene_partners_per_drug = nil)
    if known_drug_partners_per_gene.present? || known_gene_partners_per_drug.present?
      calculate_interaction_score(known_drug_partners_per_gene, known_gene_partners_per_drug)
    elsif self.score.nil?
      calculate_interaction_score(known_drug_partners_per_gene, known_gene_partners_per_drug)
    else
      self.score
    end
  end

  def calculate_interaction_score(drug_partners_per_gene = nil, gene_partners_per_drug = nil, update = false)
    drug_partners_per_gene = Interaction.group(:gene_id).count if drug_partners_per_gene.nil?
    avg_drug_partners_per_gene = drug_partners_per_gene.values.sum / drug_partners_per_gene.values.size.to_f
    drug_partners_for_this_gene = drug_partners_per_gene[gene_id]

    gene_partners_per_drug = Interaction.group(:drug_id).count if gene_partners_per_drug.nil?
    avg_gene_partners_per_drug = gene_partners_per_drug.values.sum / gene_partners_per_drug.values.size.to_f
    gene_partners_for_this_drug = gene_partners_per_drug[drug_id]

    drug_specificity = avg_gene_partners_per_drug / gene_partners_for_this_drug
    gene_specificity = avg_drug_partners_per_gene / drug_partners_for_this_gene
    evidence_score = publications.count + sources.count
    interaction_score = evidence_score * drug_specificity * gene_specificity

    if update
      self.score = interaction_score
      self.drug_specificity = drug_specificity
      self.gene_specificity = gene_specificity
      self.evidence_score = evidence_score
      save!
    end

    interaction_score
  end

end
