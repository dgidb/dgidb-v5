file = File.join(Rails.root, 'data_version.yml')
data = YAML.load_file(file)

DATA_VERSION = data.dig('version')

if DATA_VERSION.nil?
  raise StandardError.new("Missing or malformed data_version.yml. Expect file at Rails.root with a version: key")
end
