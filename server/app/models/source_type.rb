class SourceType < ::ActiveRecord::Base
  include Genome::Extensions::UUIDPrimaryKey
  include Genome::Extensions::EnumerableType
  self.inheritance_column = :class_type
  has_and_belongs_to_many :sources

  private

  def self.enumerable_cache_key
    'all_source_types'
  end
end
