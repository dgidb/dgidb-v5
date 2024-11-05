module Analytics
  extend ActiveSupport::Concern

  def get_trace_mode(request)
    return unless Rails.env.production?

    query_types = %w[search-genes search-drugs]
    if request.headers['dgidb-client-name'] == 'dgidb-frontend'
      :frontend_analytics if query_types.include?(request.headers['dgidb-query-type'])
    else
      :api_analytics
    end
  end

  module_function :get_trace_mode
end
