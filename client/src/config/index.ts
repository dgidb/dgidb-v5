import { GraphQLClient } from 'graphql-request';

export const API_URL = 'http://127.0.0.1:3000/api/graphql';
export const graphQLClient = new GraphQLClient(API_URL);

