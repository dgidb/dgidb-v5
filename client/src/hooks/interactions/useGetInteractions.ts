import { useQuery } from 'react-query';
import { GraphQLClient, request, gql  } from 'graphql-request';
// import gql from 'graphql-tag'
// import { useGetInteractions } from './useGetInteractions';

const API_URL = 'http://127.0.0.1:3000/api/graphql';


const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    Authorization: `Bearer ${process.env.API_KEY}`
  }
});

export function useGetInteractions(id: string) {
  return useQuery(["get-interactions", id], async () => {
    const { getInteractions } = await graphQLClient.request(gql`
    query gene($id: String!) {
      gene(id: $id) {
        interactions{interactionClaims{drugClaim{drug{name}}}}
      }
    }
   `,
   { id }
   );

    return getInteractions;
  });
}

// export const useGetInteractions = (key: string, variables?: string, config = {}) => {

  // const query = gql`
  //   query gene($id: String!) {
  //     gene(id: $id) {
  //       interactions{interactionClaims{drugClaim{drug{name}}}}
  //     }
  //   }
  //  `
//   const endpoint = 'http://127.0.0.1:3000/api/graphql';

//   const fetchData = async () => await request(endpoint, query, variables)

//   return useQuery(key, fetchData, config);
// }