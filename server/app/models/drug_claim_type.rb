class DrugClaimType < ::ActiveRecord::Base
  # include Genome::Extensions::UUIDPrimaryKey
  # include Genome::Extensions::EnumerableType
  # include Genome::Extensions::HasCacheableQuery
  self.inheritance_column = :class_type
  has_and_belongs_to_many :drug_claims, :join_table => 'drug_claim_types_drug_claims'

  #cache_query :all_type_names, :all_drug_claim_type_names

  def self.all_type_names
    pluck(:type).sort
  end

  private
  def self.enumerable_cache_key
    'all_drug_claim_types'
  end
end

