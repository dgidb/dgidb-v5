#Copied from https://github.com/pganalyze/graphql-batch-example under MIT license and modified

module Loaders
  class PolymorphicWindowLoader < GraphQL::Batch::Loader
    attr_reader :loaded_model, :relation_name, 
      :limit, :order_col, :order_dir,
      :related_model, :merge, :foreign_key

    def self.loader_key_for(*group_args)
      # avoiding including the `merge` lambda in loader key
      # each lambda is unique which defeats the purpose of
      # grouping queries together
      [self].concat(group_args.slice(0, 5))
    end

    def initialize(loaded_model, relation_name, related_model, limit:, order_col: :id, order_dir: :asc, merge: nil)
      @loaded_model = loaded_model
      @related_model = related_model
      @relation_name = relation_name
      @limit = limit
      @order_col = order_col
      @order_dir = order_dir
      @merge = merge
      @foreign_key = "#{relation_name}_id"
    end

    def perform(foreign_ids)
      # build the sub-query, limiting results by foreign key at this point
      # we don't want to execute this query but get its SQL to be used later
      ranked_from = loaded_model.
        select("*,
        row_number() OVER (
          PARTITION BY #{relation_name}_id ORDER BY #{order_col} #{order_dir}
        ) as rank")
        .where(foreign_key => foreign_ids)
        .where("#{relation_name}_type = ?", related_model.to_s)
        .to_sql

      # use the sub-query from above to query records which have a rank
      # value less than or equal to our limit
      scope = loaded_model
        .from("(#{ranked_from}) as #{loaded_model.table_name}")
        .where("rank <= #{limit}")
        .where("#{relation_name}_type = ?", related_model.to_s)
        .where(foreign_key => foreign_ids)

        scope = scope.merge(merge) if merge.present?
        records  = scope.to_a

        # match records and fulfill promises
        foreign_ids.each do |foreign_id|
          matching_records = records.select do |r|
            foreign_id == r.send(foreign_key)
          end
          fulfill(foreign_id, matching_records)
        end
    end
  end
end
