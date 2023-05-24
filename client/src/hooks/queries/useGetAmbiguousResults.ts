import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";
import { ResultTypes } from "types/types";

const getGeneMatchesQuery = gql`
  query geneMatches($searchTerms: [String!]!) {
    geneMatches(searchTerms: $searchTerms) {
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
  query drugMatches($searchTerms: [String!]!) {
    drugMatches(searchTerms: $searchTerms) {
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

export function useGetMatchedResults(names: string[], type: ResultTypes) {
  const key = type + names;
  const requestQuery =
    type === ResultTypes.Gene ? getGeneMatchesQuery : getDrugMatchesQuery;
  return useQuery(
    key,
    async () => {
      const res = await graphQLClient.request(requestQuery, {
        searchTerms: names,
      });
      return res;
    },
    { enabled: names.length > 0 }
  );
}
