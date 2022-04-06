import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

// by multiple genes
const getInteractionsByGenesQuery = gql`
  query genes($names: [String!]!) {
    genes(name: $names) {
      interactions {
        drug{name, approved}
        gene{name}
        interactionScore
      }
    }
  }
`

export function useGetInteractionsByGenes(names: string[]) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getInteractionsByGenesQuery,
      { names }
    );
    return res;
  }, 
  {enabled: names !== []});
}