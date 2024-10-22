module ApiAnalyticsTracer
  def analyze_query(query: )
    params = {
      user_ip: query.context[:request_ip],
      query: query.query_string,
      query_variables: query.provided_variables
    }

    SubmitApiAnalytics.perform_later(params)
    super
  end
end
