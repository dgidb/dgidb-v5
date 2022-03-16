import { useQuery } from 'react-query';
import { GraphQLClient, request, gql  } from 'graphql-request';
// import gql from 'graphql-tag'
// import { useGetInteractions } from './useGetInteractions';

// const API_URL = 'http://127.0.0.1:3000/api/graphql';


const graphQLClient = new GraphQLClient('http://127.0.0.1:3000/api/graphql');

const getInteractionsQuery = gql`
  query gene($id: String!) {
    gene(id: $id) {
      interactions{interactionClaims{drugClaim{drug{name}}}}
    }
  }
 `

export function useGetInteractions(id: string) {
  return useQuery(["get-interactions", id], async () => {
    const { getInteractions } = await graphQLClient.request(getInteractionsQuery, { id });
    console.log('getInteractions', getInteractions)
    return getInteractions;
  });
}

export const useGQLQuery = (key: any, query: any, variables: any, config = {}) => {
  const endpoint = 'http://127.0.0.1:3000/api/graphql';

  const graphQLClient = new GraphQLClient(endpoint);

  const fetchData = async () => await graphQLClient.request(query, variables);
  

  return useQuery(key, fetchData, config);
};


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

