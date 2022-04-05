// hooks/dependencies
import React, { useState, useEffect} from 'react';
import SearchBar from '../../components/SearchBar/SearchBar.component';
import { useGetInteractionsByGene } from '../../hooks/interactions/useGetInteractions';
import { useNavigate } from 'react-router-dom';

// styles
import { Button } from 'antd';
import './home.page.scss';

export const Home: React.FC = () => {

  const [queryParams, setQueryParams] = useState<string []>([]);

  const handleSubmit = async () => {
    refetch();
    navigate('/results');
  }; 

  const navigate = useNavigate();
  
  const { refetch } = useGetInteractionsByGene(queryParams[0] || '');

  // 774e749f-4a89-47aa-8226-f12026812b04
  // 5c60a645-e13e-4236-8aaf-5879bd44993e
  return (
    <div className="home-page-container" >

      <div className="logo">
        DGIdb
      </div>
      <div className="tagline">
        THE DRUG GENE INTERACTION DATABASE
      </div>

      <SearchBar setQueryParams={setQueryParams} queryParams={queryParams} handleSubmit={handleSubmit} />

      <div className="home-buttons">
        <Button onClick={() => handleSubmit()} style={{margin: 20, backgroundColor: '#3B2F41', border: 'none', width: '120px', height: '35px', fontSize: 16,}}type="primary">Search</Button>
        <Button style={{margin: 20, backgroundColor: '#3B2F41', border: 'none', width: '120px', height: '35px',  fontSize: 16,}} type="primary">Demo</Button>
      </div>
      <div className="home-blurb">
        An open-source search engine for drug-gene interactions and the druggable genome.
      </div>
      <div className="home-links">
        <span style={{color: 'white', padding: '0 15px', fontSize: 18, textDecoration: 'underline'}} >
          API
        </span>
        <span style={{color: 'white',  padding: '0 15px',fontSize: 18, textDecoration: 'underline'}} >
          Downloads
        </span>
        <span style={{color: 'white',  padding: '0 15px',fontSize: 18, textDecoration: 'underline'}} >
          Github
        </span>
      </div>
    </div>
    )
}
