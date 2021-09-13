#Copied from https://raw.githubusercontent.com/Shopify/graphql-batch/3a157b54917a3a1dd2431f38d88ea4b89fd36942/examples/record_loader.rb

module Loaders
  class RecordLoader < GraphQL::Batch::Loader
    def initialize(model, column: model.primary_key, where: nil)
      @model = model
      @column = column.to_s
      @column_type = model.type_for_attribute(@column)
      @where = where
    end

    def load(key)
      super(@column_type.cast(key))
    end

    def perform(keys)
      query(keys).each { |record| fulfill(record.public_send(@column), record) }
      keys.each { |key| fulfill(key, nil) unless fulfilled?(key) }
    end

    private

    def query(keys)
      scope = @model
      scope = scope.where(@where) if @where
      scope.where(@column => keys)
    end
  end
end
