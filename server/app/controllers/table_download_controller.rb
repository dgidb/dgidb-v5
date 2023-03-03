class TableDownloadController < ApplicationController

  @@table_resolvers = {
    gene_interaction_results: Resolvers::Genes
  }

  def download_table
    if res = @@table_resolvers[params[:table_name].to_sym]
      stream_table(resolver: res)
    else
      head :bad_request
    end
  end

  private
  def stream_table(resolver: )
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
      collection << CSV.generate_line(resolver.table_headers, col_sep: "\t")
      resolver.new(filters: variables).results.find_each(batch_size: 250) do |result|
        Array(resolver.to_row(object: result)).each do |row|
          collection << CSV.generate_line(row, col_sep: "\t")
        end
      end
    end
  end
end
