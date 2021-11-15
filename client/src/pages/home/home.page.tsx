import React, { useState, useEffect} from 'react';
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { GetInteractions } from '../../hooks/sources/useGetInteractions';
import ReactTags from 'react-tag-autocomplete'


import 'antd/dist/antd.css';
import { Input, Button, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

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

  const [tags, setTags] = useState(
    {
      tags: [
        { id: 1, name: "Apples" },
        { id: 2, name: "Pears" }
      ],
      suggestions: [
        { id: 3, name: "Bananas" },
        { id: 4, name: "Mangos" },
        { id: 5, name: "Lemons" },
        { id: 6, name: "Apricots" }
      ]
    }
  );

  // const handleAddition = (tag) => {
  //   console.log("add");
  //   setTags([...tags, tag]);
  // };

  const handleDelete = () => {

  }

  const reactTags = React.createRef()


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
  <Input 
    size="large" 
    placeholder="" 
    prefix={<UserOutlined />} 
    style={{ width: 700}}
  />

  {/* <ReactTags
    tags={tags}
    ref={reactTags}
    onDelete={handleDelete}
    onAddition={(e) => handleAddition(e)}
  /> */}

  <div className="home-buttons">
    <Button type="primary">Search</Button>
    <Button type="primary">Demo</Button>
  </div>
  <div className="home-blurb">
    An open-source search engine for drug-gene interactions and the druggable genome.
  </div>
  <div className="home-links">
    <Button type="link">
      API
    </Button>
    <Button type="link">
      Downloads
    </Button>
    <Button type="link">
      Github
    </Button>
  </div>

  <div className="home-footer">
    Disclaimer: This resource is intended for purely research purposes. It should not be used for emergencies or medical or professional advice. 
  </div>

  </div>
  )
}

export default Home