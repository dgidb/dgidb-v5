import React, { useState, useEffect} from 'react';
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { GetInteractions } from '../../hooks/sources/useGetInteractions';
import ReactTags from 'react-tag-autocomplete'

import 'antd/dist/antd.css';
import { Input, Button, Tag, Select, AutoComplete, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import './home.page.scss';

const Home: React.FC = () => {
  
  // const [input, setInput ] = useState<string>('');
  // const [result, setResult] = useState("");
  const [selected, setSelected] = useState<any>([]);
  const [newTag, setNewTag] = useState<any>('');
  const [options, setOptions] = useState<any>([{value: 'Apple', label: 'Apple' }, {value: 'Banana', label: 'Banana' }, {value: 'Orange', label: 'Orange' }]);
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

  const handleDelete = () => {

  }

  let antInput = (document.querySelector('input') as HTMLInputElement);

  const clearInputText = () => {
    console.log('clearing');
    (document.querySelector('input') as HTMLInputElement).value = '';
    console.log('why is it still this:');
    console.log(document.querySelector('input'))
  }

  // console.log(antInput)

  useEffect(() => {
    setNewTag('');
  }, [selected])

  function handleType(value: any) {

    console.log(`newTag is ${newTag}`);

    if (value.key === 'Backspace'){
      setNewTag(newTag.slice(0, -1))
    } else if (value.key === 'Enter' || value.key === 'Spacebar') {
      console.log('pushing')
      setOptions([...options, {value: newTag, label: newTag}]);
      setSelected([...selected, newTag])
      clearInputText();
    } else if(/^[a-zA-Z0-9-_]+$/.test(value.key)){
      console.log('passed the regex and not backspace or spacebar or enter')
      setNewTag(`${newTag}${value.key}`)
    } else {
      return
    }


  }

  const handleChange = (value: any) => {
    setSelected(value);
  }

  const clearSelected = () => {
    setSelected([]);
  }



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
  <div className="search-container"> 
  <div className="search-subcontainer">

    <div className="search-input">
      <Form.Item>
        <Select 
          onChange={handleChange}
          size="large" 
          placeholder="" 
          mode="tags"
          tokenSeparators={[',']}
          // prefix={<UserOutlined />} 
          style={{ width: 700}}
          options={options}
          onInputKeyDown={handleType}
          value={selected}
        />
      </Form.Item>

      </div>
    <div className="search-dropdown">
      <Select 
        defaultValue="lucy" 
        style={{ width: 120 }} 
        size="large"
      >
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    </div>
    </div>

  </div>


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