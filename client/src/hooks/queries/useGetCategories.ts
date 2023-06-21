import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getCategoriesQuery = gql`
  query genes($names: [String!]!) {
    genes(names: $names) {
      nodes {
        name
        geneCategoriesWithSources {
          name
          sourceNames
        }
      }
    }
  }
`;
export function useGetCategories(names: string[]) {
  return useQuery(
    'categories' + names,
    async () => {
      const res = await graphQLClient.request(getCategoriesQuery, { names });
      return res;
    },
    { enabled: names.length > 0 }
  );
}

const getCategoriesbySourceQuery = gql`
  query categories($names: [String!]!) {
    genes(names: $names) {
      nodes {
        geneCategories {
          name
        }
      }
    }
  }
`;

export function useGetCategoriesBySource(names: string[]) {
  return useQuery(
    'categories-by-source' + names,
    async () => {
      const res = await graphQLClient.request(getCategoriesbySourceQuery, {
        names,
      });
      return res;
    },
    { enabled: names.length > 0 }
  );
}
