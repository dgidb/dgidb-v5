module Types
  class OrganizationType < Types::BaseObject
    field :name, String, null: false, description: 'Name of the organization responsible for the service'
    field :url, String, null: false, description: 'URL of the website of the organization'

    def name
      'Wagner and Griffith laboratories'
    end

    def url
      'https://dgidb.org/about#contact'
    end
  end
end
