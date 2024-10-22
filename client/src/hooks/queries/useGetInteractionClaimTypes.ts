import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getInteractionClaimTypesQuery = gql`
  query {
    interactionClaimTypes {
      nodes {
        type
        definition
        reference
        directionality
      }
    }
  }
`;

export function useGetInteractionClaimTypes() {
  return useQuery('interaction_claim_types', async () => {
    const res = await graphQLClient.request(
      getInteractionClaimTypesQuery,
      {},
      { 'dgidb-client-name': 'dgidb-frontend' }
    );
    return res;
  });
}
