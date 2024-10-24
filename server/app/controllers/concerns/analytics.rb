module Analytics
  extend ActiveSupport::Concern

  def get_trace_mode(request)
    return unless Rails.env.production?

    if request.headers['dgidb-client-name'] == 'dgidb-frontend'
      :frontend_analytics
    elsif request.headers['RAW_POST_DATA'] && !request.headers['RAW_POST_DATA'].include?('IntrospectionQuery')
      :api_analytics
    end
  end

  module_function :get_trace_mode
end
