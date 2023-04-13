require 'json'
require 'rubygems/version'

module Genome
  module Downloaders
    class DrugBankDownloader < Genome::Downloaders::Base
      def initialize
        @current_version = get_current_version
      end

      def get_current_version
        version_response = http_request('https://go.drugbank.com/releases.json')
        data = JSON.parse(version_response)
        version = data[0]['version']

        version
      end

      def is_up_to_date
        current_version_parsed = Gem::Version.new(@current_version)
        db_version = Source.where(source_db_name: 'DrugBank').first.source_db_version
        db_version_parsed = Gem::Version.new(db_version)

        db_version_parsed >= current_version_parsed
      end

      def download_latest
        version_url = @current_version.gsub('.', '-')
        download_uri = URI("https://go.drugbank.com/releases/#{version_url}/downloads-all-full-database")
        outfile = 'lib/data/drugbank/claims.xml'
        request = Net::HTTP::Get.new(download_uri)
        request.basic_auth(ENV['DRUGBANK_EMAIL'], ENV['DRUGBANK_PASSWORD'])
        http_download(download_url, outfile, request)
      end
    end
  end
end
