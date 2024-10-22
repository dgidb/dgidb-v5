module Analytics
  extend ActiveSupport::Concern

  def get_trace_mode(request)
    return unless Rails.env.production?

    if request.headers['dgidb-client-name'] == 'dgidb-frontend'
      :frontend_analytics
    elsif request.headers['query'] && !requests.headers['query'].include?('IntrospectionQuery')
      :api_analytics
    end
  end

  module_function :get_trace_mode
end
