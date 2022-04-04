import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

// by one gene
const getInteractionsByGeneQuery = gql`
  query gene($id: String!) {
    gene(id: $id) {
      interactions{interactionClaims{drugClaim{drug{name}}}}
    }
  }
 `

 export function useGetInteractionsByGene(id: string) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getInteractionsByGeneQuery,
      { id }
    );
    return res;
  }, 
  {enabled: id !== ''});
}

// by multiple genes
const getInteractionsByGenesQuery = gql`
  query gene($names: [String!]!) {
    genes(name: $names) {
      interactions{interactionClaims{drugClaim{drug{name}}}}
    }
  }
 `

export function useGetInteractionsByGenes(ids: string[]) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getInteractionsByGeneQuery,
      { ids }
    );
    return res;
  }, 
  {enabled: ids !== []});
}