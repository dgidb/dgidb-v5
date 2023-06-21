class DrugApplication < ActiveRecord::Base
  include Genome::Extensions::UUIDPrimaryKey

  belongs_to :drug
end

