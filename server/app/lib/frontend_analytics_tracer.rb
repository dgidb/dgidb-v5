module FrontendAnalyticsTracer
  FRONTEND_LOGGER = Logger.new(File.join(Rails.root, 'log', 'frontend-queries.log'))
  def analyze_query(query:)
    params = {
      user_ip: query.context[:request_ip],
      query_type: query.selected_operation.selections&.first&.name,
      is_categories_search: query.context['dgidb-genes-search-mode'] == 'categories',
      query_variables: query.provided_variables
    }

    FRONTEND_LOGGER.info(params)
    super
  end
end
