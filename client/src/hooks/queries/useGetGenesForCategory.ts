import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

const getGenesForCategoryQuery = gql`
  query geneClaimCategory($categoryName: String!, $sourceDbNames: [String!]!) {
    geneClaimCategory(name: $categoryName) {
      name
      genes(sourceNames: $sourceDbNames) {
        edges {
          node {
            name
            conceptId
            longName
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
    `genes-for-category-${categoryName}-db-${sourceDbNames}`,
    async () => {
      const res = await graphQLClient.request(getGenesForCategoryQuery, {
        categoryName: categoryName,
        sourceDbNames: sourceDbNames,
      });
      return res;
    },
    { enabled: categoryName !== "" }
  );
}
