require 'uri'
require 'net/http'

class SubmitApiAnalytics < SubmitAnalyticsEvent
  def create_body(opts)
    {
      client_id: SecureRandom.uuid,
      user_id: opts[:user_ip],
      timestamp_micros: DateTime.now.strftime('%s%6N'),
      events: [
        {
          name: 'api_request',
          params: {
            query_type: opts[:query_type],
            query: opts[:query],
            query_params: opts[:query_params],
            ip: opts[:user_ip]
          }
        }
      ]
    }.to_json
  end
end
