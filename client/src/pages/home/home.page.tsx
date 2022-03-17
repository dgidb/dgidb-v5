// hooks/dependencies
import React, { useState, useEffect} from 'react';
import SearchBar from '../../components/searchbar/SearchBar.component';
import ReactTags from 'react-tag-autocomplete'
import { useGetInteractions } from '../../api/hooks/interactions/useGetInteractions';

// styles
import { Button } from 'antd';
import './home.page.scss';

const Home: React.FC = () => {

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

  // }; 

  return (
    <div className="home-page-container" >

  <div className="logo">
    DGIdb
  </div>
  <div className="tagline">
  THE DRUG GENE INTERACTION DATABASE
  </div>

  <SearchBar />


  <div className="home-buttons">
    <Button style={{margin: 20, backgroundColor: '#3B2F41', border: 'none', width: '120px', height: '35px', fontSize: 16,}}type="primary">Search</Button>
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

  <div className="home-footer">
    Disclaimer: This resource is intended for purely research purposes. It should not be used for emergencies or medical or professional advice. 
  </div>

  </div>
  )
}

export default Home