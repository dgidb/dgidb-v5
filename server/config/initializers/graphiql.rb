GraphiQL::Rails.config.initial_query =  <<~QUERY
# Below is an example of fetching a page of accepted Evidence Items using the GraphQL API.
# You can press the "Play >" button to run the query and see the response. Note how the structure mirrors the fields requested in the query.
# Clicking "Docs" in the upper right will allow you to explore the schema including all available queries and the fields you can request on them.
#
# The GraphiQL environment will offer autocompletion and validation as you experient with what's possible.
#
{
  drugs(names: ["DOVITINIB"]) {
    nodes {
      interactions {
        gene {
          name
        }
        drug {
          name
        }
        interactionScore
        interactionTypes {
          type
          directionality
        }
      }
    }
  }
}
QUERY
