import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

// TODO update query
const getGenesForCategoryQuery = gql`
  query geneClaimCategory($categoryName: String!, $sourceDbNames: [String!]!) {
    geneClaimCategory(name: $categoryName) {
      name
      genes(categoryName: $categoryName, sourceNames: $sourceDbNames) {
        edges {
          node {
            name
            conceptId
            sourceDbNames
          }
        }
      }
    }
  }
`;

export function useGetGenesForCategory(
  categoryName: String,
  sourceDbNames: String[]
) {
  return useQuery(
    "genes-for-category",
    async () => {
      const res = await graphQLClient.request(getGenesForCategoryQuery, {
        categoryName: categoryName,
        sourceDbNames: sourceDbNames,
      });
      return res;
    },
    // TODO try running w/ no source names to get all at once
    { enabled: categoryName !== "" && sourceDbNames.length > 0 }
  );
}
