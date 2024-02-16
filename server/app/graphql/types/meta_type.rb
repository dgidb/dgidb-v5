module Types
  class MetaType < Types::BaseObject
    field :id, String, null: false, description: 'Unique identifier for service.'
    field :data_version, String, null: false, description: 'Version of the data being served by DGIdb'
    field :name, String, null: false, description: 'Human readable name of the service'
    field :type, Types::ServiceType, null: false
    field :description, String, null: false
    field :organization, Types::OrganizationType, null: false
    field :contact_url, String, null: false, description: 'URL of the contact for the provider of this service'
    field :documentation_url, String, null: false, description: 'URL of the documentation of this service'
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false, description: 'Timestamp describing when the service was first deployed and available'
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: 'Timestamp describing when the service was last updated'
    field :environment, String, null: false, description: 'Environment the service is running in'
    field :version, String, null: false, description: 'Version of the service being described'

    def id
      'org.dgidb.graphql'
    end

    def data_version
      DATA_VERSION
    end

    def name
      'DGIdb'
    end

     def type
       {}
     end

     def description
       "An open-source search engine for drug-gene interactions and the druggable genome."
     end

     def organization
       {}
     end

     def contact_url
       "mailto:help@dgidb.org"
     end

     def documentation_url
       'https://dgidb.org/api/graphiql'
     end

     def created_at
       #version 5.0.0 initial release on GitHub
       DateTime.parse("October 20, 2023 8:51 AM CDT")
     end

     def updated_at
       DateTime.parse(github_release&.dig("published_at"))
     end

     def environment
       Rails.env
     end

     def version
       github_release&.dig("tag_name")
     end

     private
     def github_release
       @rel ||= GithubRelease.current
     end
  end
end
