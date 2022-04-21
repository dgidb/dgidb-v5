import { GraphQLClient } from 'graphql-request';

export const API_URL = process.env.REACT_APP_API_URI;
export const graphQLClient = new GraphQLClient(API_URL!);