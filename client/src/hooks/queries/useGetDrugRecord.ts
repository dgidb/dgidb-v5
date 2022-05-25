import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';


const getDrugRecordQuery = gql`
  query genes($names: [String!]!) {
    genes(name: $names) {
      geneCategories {
        name
      }
    }
  }
`

export function useGetDrugRecord(names: string[]) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getDrugRecordQuery,
      { names }
    );
    return res;
  }, 
  {enabled: names !== []});
}