import React, { useState } from 'react';
import { useLazyQuery, gql } from "@apollo/client";

const Home: React.FC = () => {
  
  const [input, setInput ] = useState<string | undefined>('');

  const GET_SOURCE = gql`
  query source($id: String!) {
    source(id: $id) {
      sourceDbName
      sourceDbVersion
    }
  }
`
  const [search, {data}] = useLazyQuery(GET_SOURCE, { variables: { id: input}});
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search();
  }; 

  return (
    <>
  <form onSubmit={handleSubmit}>
    <div>Enter an ID. For example: 0009971b-b332-44a2-82a7-45128289099d</div>
    <input
      onChange={(e) => setInput(e.target.value)}
    />
    <button type="submit">
      Submit
    </button>
  </form>
    
  <div>Source name: {data?.source?.sourceDbName}</div>
  <div>Source version: {data?.source?.sourceDbVersion}</div>
  </>
  )
}

export default Home