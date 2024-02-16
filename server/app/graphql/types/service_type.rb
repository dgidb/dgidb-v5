module Types
  class ServiceType < Types::BaseObject
    field :group, String, null: false, description: 'Namespace in reverse domain name format.'
    field :artifact, String, null: false, description: 'Name of the API or GA4GH specification implemented.'
    field :version, String, null: false, description: 'API Version (semantic)'

    def group
      'org.dgidb'
    end

    def artifact
      'DGIdb GraphQL'
    end

    def version
      GithubRelease.current&.dig("tag_name")
    end
  end
end
