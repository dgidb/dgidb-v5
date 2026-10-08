class SpaController < ApplicationController
  def index
    response.headers['Cache-Control'] = 'no-cache'
    render html: File.read(Rails.root.join('public', 'index.html')).html_safe
  end
end
