class TableDownloadController < ApplicationController

  @@table_resolvers = {
    gene_interaction_results: [Resolvers::Genes, GeneInteractionsTsv],
    drug_interaction_results: [Resolvers::Drugs, DrugInteractionsTsv],
    gene_category_results: [Resolvers::Genes, GeneCategoriesTsv]
  }

  def download_table
    table_name = params[:table_name].to_sym

    if @@table_resolvers.has_key?(table_name)
      res, mapper = @@table_resolvers[table_name]
      stream_table(resolver: res, mapper: mapper)
    else
      head :bad_request
    end
  end

  private
  def stream_table(resolver: , mapper:)
    variables = prepare_variables(params[:variables])
    variables.delete('sortBy')
    variables.transform_keys! { |k| GraphQL::Schema::Member::BuildType.underscore(k) }

    headers.delete("Content-Length")
    headers["Cache-Control"] = "no-cache"
    headers["Content-Type"] = "text/csv"
    headers["Content-Disposition"] = "attachment; filename=\"#{params[:action]}-#{Date.today}.tsv\""
    headers["X-Accel-Buffering"] = "no"

    response.status = 200

    self.response_body = Enumerator.new do |collection|
      collection << CSV.generate_line(mapper.table_headers, col_sep: "\t")
      resolver.new(filters: variables).results.find_each(batch_size: 250) do |result|
        Array(mapper.to_row(object: result)).each do |row|
          collection << CSV.generate_line(row, col_sep: "\t")
        end
      end
    end
  end
end
