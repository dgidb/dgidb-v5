import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';


const getCategoriesQuery = gql`
  query genes($names: [String!]!) {
    genes(name: $names) {
      geneCategories {
        name
      }
    }
  }
`

export function useGetCategories(names: string[]) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getCategoriesQuery,
      { names }
    );
    return res;
  }, 
  {enabled: names !== []});
}