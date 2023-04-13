require 'net/ftp'
require 'net/http'
require 'tmpdir'
require 'ruby-progressbar'

module Genome
  module Downloaders
    class Base
      def http_request(url)
        parsed_uri = URI.parse(url)
        http = Net::HTTP.new(parsed_uri.host, parsed_uri.port)
        http.use_ssl = true

        request = Net::HTTP::Get.new(parsed_uri.request_uri)

        response = http.request(request)
        return response.body
      end

      def ftp_download(uri, outfile)
        fname = File.basename(uri.path)

        Net::FTP.open(uri.host) do |ftp|
          ftp.login
          ftp.chdir(File.dirname(uri.path))
          size = ftp.size(fname)
          puts uri
          puts size
          pbar = ProgressBar.create(title: 'Downloading', total: size, format: "%t: %p%% %a |%B|")
          ftp.getbinaryfile(fname, outfile, Net::FTP::DEFAULT_BLOCKSIZE) do |data|
            pbar.progress += data.size
          end
          ftp.close
        end
      end

      def http_download(uri, outfile, request = nil)
        File.open(outfile, 'wb') do |file|
          Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
            if request.nil?
              request = Net::HTTP::Get.new(uri)
            end
            size = http.request_head(uri)['Content-Length'].to_i
            pbar = ProgressBar.create(title: 'Downloading', total: size, format: "%t: %p%% %a |%B|")

            http.request(request) do |response|
              response.read_body do |chunk|
                file.write(chunk)
                pbar.progress += chunk.size
              end
            end

            pbar.finish
          end
        end
      end
    end
  end
end
