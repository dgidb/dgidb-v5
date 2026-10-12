import { GraphQLClient } from 'graphql-request';

export const API_URL = import.meta.env.VITE_API_URI;
export const graphQLClient = new GraphQLClient(API_URL!, {
  headers: { 'dgidb-client-name': 'dgidb-frontend' },
});
