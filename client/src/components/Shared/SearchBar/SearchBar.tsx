// hooks/dependencies
import React, { useState, useContext, useEffect } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';

// styles, icons
import 'antd/dist/antd.css';
import './SearchBar.scss';
import { Autocomplete, MenuItem, Select, TextField } from '@mui/material';

type SearchBarProps = {
  handleSubmit: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({handleSubmit }) => {

  const {state, dispatch} = useContext(GlobalClientContext);
  console.log(state)

  const [inputValue, setInputValue] = useState<any>('');
  const [options, setOptions] = useState<any>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const onKeyDown = (value: any) => {

    let deleteTag = value.key === 'Backspace' && !inputValue.length;
    let saveTag = (value.key === 'Enter' || value.key === ' ' || value.key === ',') && inputValue.length;
    let search = value.key === 'Enter' && !inputValue.length && state.searchTerms.length;

    if (deleteTag) {
      dispatch({type: ActionTypes.DeleteLastTerm});
    }
    else if (saveTag) {
      dispatch({type: ActionTypes.AddTerm, payload: inputValue})
      setInputValue('');
    } 
    else if (search) {
      handleSubmit();
    }
    return;
  }
  
  return (
  <div className="search-container"> 
    <div className="search-subcontainer">
      <div className="search-dropdown">
        <Select 
          value={state.interactionMode}
          style={{ width: 200 }} 
          onChange={(event) => {
            const value = event.target.value
            if (value === 'gene'){
              dispatch({type: ActionTypes.SetByGene})
            } else if (value === 'drug'){
              dispatch({type: ActionTypes.SetByDrug})
            } else if (value === 'categories'){
              dispatch({type: ActionTypes.SetGeneCategories})
            }
          }}
        >
          <MenuItem className="hi4" value="gene">Interactions by Gene</MenuItem>
          <MenuItem value="drug">Interactions by Drug</MenuItem>
          <MenuItem value="categories">Gene Categories</MenuItem>
        </Select>
      </div>
      <div className="search-input">
          <Autocomplete 
            multiple={true}
            value={[]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Multiple values"
                placeholder="Favorites"
              />
            )}
            options={options} />
        </div>
      </div>
  </div>
  )
}

export default SearchBar;