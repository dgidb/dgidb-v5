module Analytics
  extend ActiveSupport::Concern

  def should_submit?(req)
    Rails.env.production?
  end

  module_function :should_submit?
end


