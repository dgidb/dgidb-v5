import { graphQLClient } from 'config';
import { useQuery } from 'react-query';
import { gql } from 'graphql-request';

const getGeneCountsForCategoriesQuery = gql`
  query categories($sourceDbNames: [String!]!) {
    categories(sourceDbNames: $sourceDbNames) {
      nodes {
        name
        geneCount(sourceDbNames: $sourceDbNames)
      }
    }
  }
`;

export const useGetGeneCountsForCategories = (
  sourceDbNames: String[],
  enabled: boolean = true
) => {
  return useQuery(
    'gene-counts-for-categories',
    async () => {
      const res = await graphQLClient.request(getGeneCountsForCategoriesQuery, {
        sourceDbNames: sourceDbNames,
      });
      return res;
    },
    { enabled: enabled }
  );
};
