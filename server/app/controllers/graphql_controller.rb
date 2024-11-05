class GraphqlController < ApplicationController
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  # protect_from_forgery with: :null_session

  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    headers = request.headers
    context = {
      trace_mode: Analytics.get_trace_mode(request),
      request_ip: request.remote_ip,
      query_type: headers['dgidb-query-type'],
      genes_search_mode: headers['dgidb-genes-search-mode']
    }
    result = DgidbSchema.execute(query, variables: variables, context:, operation_name: operation_name)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?
    handle_error_in_development(e)
  end


  private
  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [{ message: e.message, backtrace: e.backtrace }], data: {} }, status: 500
  end
end
