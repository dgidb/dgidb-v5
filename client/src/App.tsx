import React from 'react';
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, } from "apollo/client";
import {onError} from '@apollo/client/link/error';

const errorLink = onError(({ graphqlErrors, networkError}) => {
  if (graphqlErrors) {
    graphqlErrors.map(({ message, location, path }) => {
      alert(`Graphql error ${message}`)
    })
  }
})

const link = from([
  errorLink, 
  new HttpLink({uri: "http://127.0.0.1:3000/graphiql" }),
])
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})

function App() {
  return (
    <ApolloProvider client={client}></ApolloProvider>
  );
}

export default App;
