module ApiAnalyticsTracer
  API_LOGGER = Logger.new(File.join(Rails.root, 'log', 'api-queries.log'))
  def analyze_query(query: )
    params = {
      user_ip: query.context[:request_ip],
      query: query.query_string.squish,
      query_variables: query.provided_variables
    }

    API_LOGGER.info(params)
    super
  end
end
