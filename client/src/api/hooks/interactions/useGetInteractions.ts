import { useQuery } from 'react-query';
import { GraphQLClient, gql  } from 'graphql-request';

const API_URL = 'http://127.0.0.1:3000/api/graphql';
const graphQLClient = new GraphQLClient(API_URL);

const getInteractionsQuery = gql`
  query gene($id: String!) {
    gene(id: $id) {
      interactions{interactionClaims{drugClaim{drug{name}}}}
    }
  }
 `
 export function useGetInteractions(id: string) {
  return useQuery('interactions', async () => {
    const res = await graphQLClient.request(
      getInteractionsQuery,
      { id }
    );
    return res;
  });
}