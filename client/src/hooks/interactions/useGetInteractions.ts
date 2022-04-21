import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

// by genes
const getInteractionsByGenesQuery = gql`
  query genes($names: [String!]!) {
    genes(name: $names) {
      name
      interactions {
        drug{name, approved}
        gene{name}
        interactionScore
        interactionTypes {
          type
        }
      }
    }
  }
`

// by drugs
const getInteractionsByDrugsQuery = gql`
  query drugs($names: [String!]!) {
    drugs(name: $names) {
      name
      interactions {
        gene{name}
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

export function useGetInteractionsByDrugs(names: string[]) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getInteractionsByDrugsQuery,
      { names }
    );
    return res;
  }, 
  {enabled: names !== []});
}