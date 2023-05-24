import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

const getGeneMatchesQuery = gql`
  query geneMatches($names: [String!]!) {
    geneMatches(searchTerms: $names) {
      directMatches {
        searchTerm
        matches {
          name
          conceptId
          interactions {
            id
            drug {
              name
              conceptId
              approved
              drugAttributes {
                name
                value
              }
            }
            interactionScore
            interactionTypes {
              type
              directionality
            }
            publications {
              pmid
            }
            sources {
              fullName
            }
          }
        }
      }
      ambiguousMatches {
        searchTerm
        matches {
          id
          name
          conceptId
        }
      }
      noMatches {
        searchTerm
      }
    }
  }
`;

const getDrugMatchesQuery = gql`
  query drugMatches($names: [String!]!) {
    drugMatches(searchTerms: $names) {
      directMatches {
        searchTerm
        matches {
          name
          conceptId
          approved
          interactions {
            id
            gene {
              name
              conceptId
              geneCategories {
                name
              }
            }
            interactionScore
            interactionTypes {
              type
              directionality
            }
            publications {
              pmid
            }
            sources {
              fullName
            }
          }
        }
      }
      ambiguousMatches {
        searchTerm
        matches {
          id
          name
          conceptId
        }
      }
      noMatches {
        searchTerm
      }
    }
  }
`;

export function useGetMatchedResults(names: string[], type: string) {
  // TODO constrain the type value better
  const key = type + names;
  const requestQuery =
    type === "gene" ? getGeneMatchesQuery : getDrugMatchesQuery;
  return useQuery(
    key,
    async () => {
      const res = await graphQLClient.request(requestQuery, {
        names,
      });
      return res;
    },
    { enabled: names.length > 0 }
  );
}
