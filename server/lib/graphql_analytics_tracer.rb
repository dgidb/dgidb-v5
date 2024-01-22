

RequestTracer = Struct.new(:user_ip, keyword_init: true) do
    def trace(key, data)
        if key == "analyze_query" # TODO: Make sure this sends exactly for terms of API requests
            query = data[:query]
            query_type = query.selected_operation.selections&.first&.name TO DO

            SubmitApiAnalytics.perform_later(
                user_ip: user_ip,
                query_type: query_type
            )
        end
        yield
    end
end


class NullTracer
    def self.trace(key, data)
        yield
    end
end



class AnalyticsTracer
    def self.for_request(req)
        RequestTracer.new(user_ip: req.remote_ip)
        # if should_submit? == True  TODO: Add in check for correct enviroment
        #   RequestTracer (real)
        # else
        #   NullTracer (dummy)
        #
    end

end