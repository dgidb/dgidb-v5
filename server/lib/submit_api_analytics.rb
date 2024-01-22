require 'uri'
require 'net/http'

class SubmitApiAnalytics < SubmitAnalyticsEvent
    def create_body(opts) # TODO: Register a custom event with GA4
        {
            client_id: SecureRandom.uuid,
            user_id: opts[:user_ip],
            timestamp_micros: DateTime.now.strftime("%s%6N"),
            events: [
                {
                    name: 'api_request',
                    params: {
                        query_type: opts[:query_type],
                        ip: opts[:user_ip]
                    }
                }
            ]
        }.to_json
    end
end