import React, { useState} from 'react';

import { useGetInteractions } from '../../hooks/interactions/useGetInteractions';

import {FilterOutlined} from '@ant-design/icons'

import 'antd/dist/antd.css';
import { Button, Select, Form, Popover, Checkbox } from 'antd';
import "antd/dist/antd.css";

import './SearchBar.component.scss';


const SearchBar: React.FC = () => {

  const testData = [
    {value: 'A2M', label: 'ABL'},
    {value: 'ABL1', label: 'ABL1'},
    {value: 'ADCY5', label: 'ADCY5'},
    {value: 'AGPAT2', label: 'AGPAT2'},
    {value: 'AGTR1', label: 'AGTR1'},
    {value: 'AIFM1', label: 'AIFM1'},
    {value: 'APEX1', label: 'APEX1'},
    {value: 'APOC3', label: 'APOC3'},
    {value: 'ATM', label: 'ATM'},
    {value: 'BAK1', label: 'BAK1'},
    {value: 'BAX', label: 'BAX'},
    {value: 'BUB1B', label: 'BUB1B'},
    {value: 'BUB3', label: 'BUB3'},
  ]

  const [selected, setSelected] = useState<any>([]);
  const [newTag, setNewTag] = useState<any>('');
  const [options, setOptions] = useState<any>(testData);
  const [showFilters, setShowFilters] = useState(false);  
  
  const { Option } = Select;

  let content = (
    <div>
      <div className="filter-options ">
        <h5>Preset Filters</h5>
        <Checkbox>Approved</Checkbox>
        <Checkbox>Antineoplastic</Checkbox>
        <Checkbox>Immunotherapies</Checkbox>
      </div>
      <div className="filter-options ">
        <h5>Advanced Filters</h5>
        <span>Source Databases</span>
        <Button style={{ width: 80}}>22 of 22</Button>
        <span>Gene Categories</span>
        <Button style={{ width: 80}}>43 of 43</Button>
        <span>Interaction Types</span>
        <Button style={{ width: 80}}>31 of 31</Button>
      </div>
    </div>

  )
  const handlePopoverChange = (visible: any) => {
    setShowFilters(visible);
  }

  const clearInputText = () => {

  }


  function handleType(value: any) {

    if (value.key === 'Backspace'){
      setNewTag(newTag.slice(0, -1))
    } else if (value.key === 'Enter' || value.key === 'Spacebar') {
      setOptions([...options, {value: newTag, label: newTag}]);
      setSelected([...selected, newTag])
      clearInputText();
    } else if (value.key.length > 1) {
      return;
    } else if(/^[a-zA-Z0-9-_]+$/.test(value.key)){
      setNewTag(`${newTag}${value.key}`)
    } else {
      return
    }
  }

  const handleChange = (value: any) => {
    setNewTag('');
    
    setSelected(value);
    
  }

  const { data, isLoading, error } = useGetInteractions('774e749f-4a89-47aa-8226-f12026812b04')

  return (

  <div className="search-container"> 
  <div className="search-subcontainer">
    <div className="search-dropdown">
      <Select 
        defaultValue="gene" 
        style={{ width: 200 }} 
        size="large"
        dropdownRender={menu => (
          <div>
            {menu}
          </div>
        )

        }
      >
        <Option value="gene">Interactions by Gene</Option>
        <Option value="drug">Interactions by Drug</Option>
      </Select>
    </div>
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

        <div className="search-filters">


      <Popover content={content} trigger="click" visible={showFilters} onVisibleChange={handlePopoverChange} >
        <FilterOutlined 
          style={{ fontSize: '150%', cursor: 'pointer'}}
        />

      </Popover>

        </div>

      </div>
    </div>
  </div>
  )
}

export default SearchBar;