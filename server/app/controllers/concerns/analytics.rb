module Analytics
  extend ActiveSupport::Concern

  def should_submit?(req)
    # TODO finalize conditions -- maybe just production?
    # Rails.env.production?
    true
  end

  module_function :should_submit?
end


