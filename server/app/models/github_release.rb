class GithubRelease
  def self.current
    Rails.cache.fetch("current_github_release", expires_in: 12.hours) do
      fetch_release
    end
  end

  private
  def self.fetch_release
    uri = URI.parse('https://api.github.com/repos/dgidb/dgidb-v5/releases?per_page=1')
    resp = Net::HTTP.get_response(uri)
    if resp.code == '200'
      JSON.parse(resp.body).first
    else
      nil
    end
  end
end
