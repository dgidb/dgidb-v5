import React, { useState, useEffect} from 'react';
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { GetInteractions } from '../../hooks/sources/useGetInteractions';

import './home.page.scss';

const Home: React.FC = () => {
  
  const [input, setInput ] = useState<string>('');
  const [result, setResult] = useState("");



  const GET_GENE = gql`
  query gene($id: String!) {
    gene(id: $id) {
      interactions{interactionClaims{drugClaim{drug{name}}}}
    }
  }
  `

  const {refetch} = useQuery(GET_GENE, {
    variables: { id: input}
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await refetch();
    setResult(JSON.stringify(res.data.gene.interactions));

  }; 


  return (
    <div className="home" >
  <form onSubmit={handleSubmit}>
    <div>Enter an gene id (like <strong>a12c98b9-06af-4f19-a4c2-8631b774963a</strong>)</div>
    <br />
    <input
      onChange={(e) => setInput(e.target.value)}
    />
    <button type="submit">
      Submit
    </button>
    
  </form>
    <br/>
  <div><b>Drug interactions:</b> 
  <div>
    {result}
  </div>
  
  </div>
  <br/>
  </div>
  )
}

export default Home