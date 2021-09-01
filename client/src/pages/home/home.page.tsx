import React, { useState } from 'react';
import { useLazyQuery, gql } from "@apollo/client";

import './home.page.scss';

const Home: React.FC = () => {
  
  const [input, setInput ] = useState<string | undefined>('');

  const GET_SOURCE = gql`
  query source($sourceDbName: String!) {
    source(sourceDbName: $sourceDbName) {
      citation
      sourceDbVersion
    }
  }
`
  const [search, {data}] = useLazyQuery(GET_SOURCE, { variables: { sourceDbName: input}});
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search();
  }; 

  return (
    <div className="home" >
  <form onSubmit={handleSubmit}>
    <div>Enter a source</div>
    <br />
    <input
      onChange={(e) => setInput(e.target.value)}
    />
    <button type="submit">
      Submit
    </button>
    
  </form>
    <br/>
  <div><b>Source name:</b> {data?.source?.citation}</div>
  <br/>
  <div><b>Source version:</b> {data?.source?.sourceDbVersion}</div>
  </div>
  )
}

export default Home