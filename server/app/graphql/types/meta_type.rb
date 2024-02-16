module Types
  class MetaType < Types::BaseObject
    field :data_version, String, null: false

    def data_version
      DATA_VERSION
    end
  end
end
