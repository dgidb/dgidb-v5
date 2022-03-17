import React, { useState, useEffect} from 'react';
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import SearchBar from '../../components/searchbar/SearchBar.component';
import ReactTags from 'react-tag-autocomplete'
import { useGetInteractions } from '../../api/hooks/interactions/useGetInteractions';

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

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

  // }; 

  const {data, isLoading, error, isSuccess} = useGetInteractions('159249ef-f594-42e0-b630-91ee6173a7cd');

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