module GoogleAnalyticsTracer
  def analyze_query(query: )
    params = {
      user_ip: query.context[:request_ip],
      query_type: query.selected_operation.selections&.first&.name,
      query_variables: query.provided_variables
    }

    SubmitApiAnalytics.perform_later(params)
    super
  end
end
