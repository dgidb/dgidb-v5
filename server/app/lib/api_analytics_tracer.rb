module ApiAnalyticsTracer
  API_LOGGER = Logger.new(File.join(Rails.root, 'log', 'api-queries.log'))
  def analyze_query(query: )
    query_type = query.selected_operation.selections&.first&.name

    return if query_type == '__schema'

    params = {
      user_ip: query.context[:request_ip],
      query: query.query_string.squish,
      query_variables: query.provided_variables,
      client_type: query.context[:client_name]
    }

    API_LOGGER.info(params)
    super
  end
end
