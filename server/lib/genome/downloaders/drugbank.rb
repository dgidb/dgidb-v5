require 'json'
require 'rubygems/version'
require 'zip'

module Genome
  module Downloaders
    class DrugBankCredentialsException < StandardError
      def initialize(msg)
        @exception_type = "custom"
        super(msg)
      end
    end

    class DrugBankDownloader < Genome::Downloaders::Base
      def initialize
        @latest_version = get_latest_version
      end

      def get_latest_version
        version_response = http_request('https://go.drugbank.com/releases.json')
        data = JSON.parse(version_response)
        version = data[0]['version']

        version
      end

      def is_up_to_date
        latest_version_parsed = Gem::Version.new(@latest_version)
        local_version = Source.where(source_db_name: 'DrugBank').first.source_db_version
        local_version_parsed = Gem::Version.new(local_version)

        local_version_parsed >= latest_version_parsed
      end

      def download_latest
        version_url = @latest_version.gsub('.', '-')
        download_uri = "https://go.drugbank.com/releases/#{version_url}/downloads/all-full-database"
        outfile = 'lib/data/drugbank/claims.zip'
        email = ENV['DRUGBANK_EMAIL']
        password = ENV['DRUGBANK_PASSWORD']
        if email.nil? or password.nil?
          raise DrugBankCredentialsException.new(
            "Couldn't find drugbank email or password -- set with env vars DRUGBANK_EMAIL and DRUGBANK_PASSWORD"
          )
        end
        # couldn't get net::http to handle the Drugbank redirect so this is a temp solution
        system("curl -Lf -o #{outfile} -u #{email}:#{password} #{download_uri}")

        Zip::File.open(outfile) do |zipfile|
          zipfile.each do |file|
            file_path = 'lib/data/drugbank/claims.xml'
            FileUtils.mkdir_p(File.dirname(file_path))
            zipfile.extract(file, file_path) { true }
          end
        end
        FileUtils.rm(outfile)
      end
    end
  end
end
