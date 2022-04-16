// hooks/dependencies
import React, { useState, useEffect, Dispatch } from 'react';
import { useGetInteractionsByGene } from 'hooks/interactions/useGetInteractions';

// styles, icons
import { Button, Select, Form, Popover, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import './SearchBar.component.scss';
import {FilterOutlined} from '@ant-design/icons'

type SearchBarProps = {
  queryParams: string[];
  setQueryParams: Dispatch<string[]>
  handleSubmit: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({queryParams, setQueryParams, handleSubmit}) => {

  const [inputValue, setInputValue] = useState<any>('');
  const [options, setOptions] = useState<any>([]);
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

  function onKeyDown (value: any) {

    let deleteTag = value.key === 'Backspace' && !inputValue.length
    let saveTag = (value.key === 'Enter' || value.key === ' ') && inputValue.length
    let search = value.key === 'Enter' && !inputValue.length && queryParams.length

    if (deleteTag) {
      let queryParamsCopy = Array.from(queryParams);
      setQueryParams(queryParamsCopy.slice(0, -1))
    }
    
    else if (saveTag) {
      setQueryParams([...queryParams, inputValue]);
      setInputValue('')
    } 

    else if (search) {
      handleSubmit();
    }

    return;
  }

// const { data: dataBatch, isLoading: isLoadingBatch, error: errorBatch } = useGetInteractionsByGenes('774e749f-4a89-47aa-8226-f12026812b04', '9c907a4f-e65d-447f-9f55-9cf760b8faf5', '774e749f-4a89-47aa-8226-f12026812b04')
// 774e749f-4a89-47aa-8226-f12026812b04
// 9c907a4f-e65d-447f-9f55-9cf760b8faf5 
// 774e749f-4a89-47aa-8226-f12026812b04

  return (
  <div className="search-container"> 
    <div className="search-subcontainer">
      <div className="search-dropdown">
        <Select 
          defaultValue="gene" 
          style={{ width: 200 }} 
          size="large"
          dropdownRender={(menu: any) => (
            <div>
              {menu}
            </div>
          )} 
        >
          <Option className="hi4" value="gene">Interactions by Gene</Option>
          <Option value="drug">Interactions by Drug</Option>
        </Select>
      </div>
      <div className="search-input">
        <Form.Item>
          <Select 
            size="large" 
            placeholder="" 
            mode="tags"
            tokenSeparators={[',', ' ']}
            options={options}
            onInputKeyDown={onKeyDown}
            value={queryParams}
            onChange={value => setQueryParams(value)}
            onSearch={value => setInputValue(value)}
          />
        </Form.Item>

          <div className="search-filters">

            <Popover 
              content={content} 
              trigger="click" 
              visible={showFilters} 
              onVisibleChange={visible => setShowFilters(visible)} 
            >
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