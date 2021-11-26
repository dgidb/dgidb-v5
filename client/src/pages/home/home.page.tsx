import React, { useState, useEffect} from 'react';
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import SearchBar from '../../components/searchbar/SearchBar.component';
import { GetInteractions } from '../../hooks/sources/useGetInteractions';
import ReactTags from 'react-tag-autocomplete'

import {FilterOutlined} from '@ant-design/icons'

import 'antd/dist/antd.css';
import { Button, Select, Form, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

import './home.page.scss';

const Home: React.FC = () => {
  
  // const [input, setInput ] = useState<string>('');
  // const [result, setResult] = useState("");
  const [selected, setSelected] = useState<any>([]);
  const [newTag, setNewTag] = useState<any>('');
  const [options, setOptions] = useState<any>([{value: 'Apple', label: 'Apple' }, {value: 'Banana', label: 'Banana' }, {value: 'Orange', label: 'Orange' }]);
  const [showFilters, setShowFilters] = useState(false);  
  
  const { Option } = Select;


  const GET_GENE = gql`
  query gene($id: String!) {
    gene(id: $id) {
      interactions{interactionClaims{drugClaim{drug{name}}}}
    }
  }
  `

  // const {refetch} = useQuery(GET_GENE, {
  //   variables: { id: input}
  // })

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const res = await refetch();
  //   setResult(JSON.stringify(res.data.gene.interactions));

  // }; 


  return (
    <div className="home-page-container" >
  {/* <form onSubmit={handleSubmit}>
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
  <br/> */}

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