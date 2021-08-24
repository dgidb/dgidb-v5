module Types
  class SourceType < Types::BaseObject
    field :id, String, null: false
    field :source_db_name, String, null: false
    field :source_db_version, String, null: false
    field :citation, String, null: false
  end
end
