require 'uri'
require 'net/http'

class SubmitAnalyticsEvent < ApplicationJob
    GA_MEASUREMENT_ID = 'G-B03N45K7C1'
    #GA_API_SECRET = Rails.application.credentials.dig(:GA_API_SECRET)  ### idk if this exists yet
    # GA_API_SECRET = ''
    # TODO: Figure out how to register a custom event for API usage

    ANALYTICS_URL = "https://www.google-analytics.com/mp/collect?api_secret=#{GA_API_SECRET}&measurement_id=#{GA_MEASUREMENT_ID}" # again, secret not sure if exists

    def perform(opts = {})
        Net::HTTP.post(URI(ANALYTICS_URL), create_body(opts))
    end

    private
    def create_body(opts)
        raise NotImplementedError.new("Implement in subclass")
    end

end