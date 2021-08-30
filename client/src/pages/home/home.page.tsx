import React, { useState } from 'react';
import { useGetSources } from '../../hooks/sources/useGetSources';

const Home: React.FC = () => {
  const [input, setInput ] = useState('');
  const [response, setResponse] = useState([]);
  let source: [] = useGetSources(input)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponse(source);
  }

  return (
    <>
  <form onSubmit={handleSubmit}>
    <h2>Enter an Id</h2>
    <input
      onChange={(e) => setInput(e.target.value)}
    />
    <button type="submit">
      Submit
    </button>
  </form>
  <div>{response}</div>
  </>
  )
}

export default Home