// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import SearchBar from 'components/SearchBar/SearchBar';
import { useGetInteractionsByGene } from 'hooks/interactions/useGetInteractions';
import { useNavigate } from 'react-router-dom';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import { Button } from 'antd';
import styles from'./Home.module.scss';

export const Home: React.FC = () => {

  const {state} = useContext(GlobalClientContext);

  const handleSubmit = async () => {
    refetch();
    navigate('/results');
  }; 

  const navigate = useNavigate();
  
  // TODO: batch query
  const { refetch } = useGetInteractionsByGene(state.searchTerms[0] || '');

  // 774e749f-4a89-47aa-8226-f12026812b04
  // 5c60a645-e13e-4236-8aaf-5879bd44993e

  return (
    <div className={styles["home-page-container"]} >

      <div className={styles["logo"]}>
        DGIdb
      </div>
      <div className={styles["tagline"]}>
        THE DRUG GENE INTERACTION DATABASE
      </div>

      <SearchBar handleSubmit={handleSubmit} />

      <div className={styles["home-buttons"]}>
        <Button onClick={() => handleSubmit()} style={{margin: 20, backgroundColor: '#3B2F41', border: 'none', width: '120px', height: '35px', fontSize: 16,}}type="primary">Search</Button>
        <Button style={{margin: 20, backgroundColor: '#3B2F41', border: 'none', width: '120px', height: '35px',  fontSize: 16,}} type="primary">Demo</Button>
      </div>
      <div className={styles["home-blurb"]}>
        An open-source search engine for drug-gene interactions and the druggable genome.
      </div>
      <div className={styles["home-links"]}>
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
