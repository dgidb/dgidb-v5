import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

const getGeneMatchesQuery = gql`
  query geneMatches($names: [String!]!) {
    geneMatches(searchTerms: $names) {
      directMatches {
        searchTerm
        matches {
          id
          name
        }
      }
      ambiguousMatches {
        searchTerm
        matches {
          id
          name
        }
      }
      noMatches {
        searchTerm
      }
    }
  }
`;

export function useGetMatchedResults(names: string[]) {
  return useQuery(
    "gene_matches",
    async () => {
      const res = await graphQLClient.request(getGeneMatchesQuery, {
        names,
      });
      return res;
    },
    { enabled: names !== [] }
  );
}