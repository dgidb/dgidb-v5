import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getCategoriesQuery = gql`
  query genes($names: [String!]!) {
    genes(name: $names) {
      name
      geneCategoriesWithSources {
        name
        sourceNames
      }
    }
  }
`
export function useGetCategories(names: string[]) {
  return useQuery('categories', async () => {
    const res = await graphQLClient.request(
      getCategoriesQuery,
      { names }
    );
    return res;
  }, 
  {enabled: names !== []});
}

const getCategoriesbySourceQuery = gql`
  query categories($names: [String!]!) {
    genes(name: $names) {
      geneCategories {
        name
      }
    }
  }
`

export function useGetCategoriesBySource(names: string[]) {
  return useQuery('categories-by-source', async () => {
    const res = await graphQLClient.request(
      getCategoriesbySourceQuery,
      { names }
    );
    return res;
  },
  {enabled: names !== []});
}