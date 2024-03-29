require 'fileutils'

module Genome
  module Downloaders
    class ChemblDownloader < Genome::Downloaders::Base
      def initialize
        @latest_version = get_latest_version
      end

      def get_latest_version
        version_response_body = http_request('https://www.ebi.ac.uk/chembl/api/data/status/')
        doc = Nokogiri::XML(version_response_body)
        version = doc.at('chembl_db_version').text
        version.downcase
      end

      def is_up_to_date
        latest_version_number = @latest_version.match(/(\d+)$/)[0]
        Source.where(source_db_name: 'ChEMBL').first.source_db_version >= latest_version_number
      end

      def download_latest
        download_url = "ftp://ftp.ebi.ac.uk/pub/databases/chembl/ChEMBLdb/latest/#{@latest_version}_sqlite.tar.gz"
        tempfile = File.join(Dir.tmpdir, File.basename(download_url))
        ftp_download(URI(download_url), tempfile)

        db_file = "#{@latest_version}/#{@latest_version}_sqlite/#{@latest_version}.db"
        chembl_dir = "lib/data/chembl/"
        # none of the Ruby tar libraries seem to play nice with the ChEMBL tarball encoding
        system("tar -xvf #{tempfile} -C #{chembl_dir} #{db_file}")
        FileUtils.mv("#{chembl_dir}#{db_file}", "#{chembl_dir}chembl.db")
        FileUtils.rm_rf("#{chembl_dir}#{@latest_version}")
      end
    end
  end
end
