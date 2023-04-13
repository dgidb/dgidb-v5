require 'net/http'
require 'nokogiri'

module Genome
  module Downloaders
    class GuideToPharmacologyDownloader < Genome::Downloaders::Base
      def initialize
        @current_version = get_current_version
      end

      def get_current_version
        url = URI('https://www.guidetopharmacology.org/download.jsp')

        response = Net::HTTP.get(url)
        doc = Nokogiri::HTML(response)

        content_boxes = doc.css('.contentboxfullhelp')
        third_content_box = content_boxes[2]
        text = third_content_box.text.strip
        matches = text.match(/Downloads are from the (\d+\.\d+) version/)

        if matches.nil?
          Rails.logger.warn('Unable to retrieve GuideToPharmacology version number')
          return nil
        end
        version = matches[1]

        version
      end

      def is_up_to_date
        if current_version.nil?
          return true
        end
        db_version = Source.where(source_db_name: 'GuideToPharmacology').first.source_db_version

        db_version >= current_version
      end

      def remove_header(file_path)
        # GToP files all include headers at the top, we want to remove them
        lines = File.readlines(file_path)
        lines.shift
        File.write(file_path, lines.join)
      end

      def download_latest
        gtop_dir = "lib/data/guide_to_pharmacology/"

        targets_and_families_uri = URI('https://www.guidetopharmacology.org/DATA/targets_and_families.csv')
        targets_and_families_outfile = "#{gtop_dir}#{File.basename(targets_and_families_uri.path)}"
        http_download(targets_and_families_uri, targets_and_families_outfile)
        remove_header(targets_and_families_outfile)

        interactions_uri = URI('https://www.guidetopharmacology.org/DATA/interactions.csv')
        interactions_outfile = "#{gtop_dir}#{File.basename(interactions_uri.path)}"
        http_download(interactions_uri, interactions_outfile)
        remove_header(interactions_outfile)
      end
    end
  end
end

