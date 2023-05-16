import './SearchBar.scss';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useContext, useEffect } from 'react';
import React from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';
import { useGetNameSuggestions } from 'hooks/queries/useGetNameSuggestions';

const SearchBar: React.FC<SearchBarProps> = ({ handleSubmit }) => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const [searchType, setSearchType] = React.useState(state.interactionMode);
  const [typedSearchTerm, setTypedSearchTerm] = React.useState('')
  const typeAheadQuery = useGetNameSuggestions(typedSearchTerm, searchType)  
  let autocompleteOptions = typeAheadQuery?.data?.genes?.nodes || []
  const drugAutocompleteOptions = typeAheadQuery?.data?.drugs?.nodes || []
  const categoryAutocompleteOptions = typeAheadQuery?.data?.categories?.nodes || []

  if (searchType === 'drug') {
    autocompleteOptions = drugAutocompleteOptions
  } else if (searchType === 'categories') {
    autocompleteOptions = categoryAutocompleteOptions
  }

  // support searching for terms that the API may not return (add user's typed term to options if it's not already there)
  if (autocompleteOptions.filter((option: { name: string; }) => option.name === typedSearchTerm).length === 0) {
    autocompleteOptions = [{name: typedSearchTerm}, ...autocompleteOptions]
  }

  const [selectedOptions, setSelectedOptions] = React.useState<any[]>([]);
  const isValidSearch = typedSearchTerm && typedSearchTerm !== '' && typedSearchTerm !== ' '


  const handleAutocompleteChange = (event: any, value: any) => {
    if (value.length === 0) {
      setSelectedOptions([])
      dispatch({type: ActionTypes.DeleteAllTerms});
    } else {
      setSelectedOptions(value);
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string
    setSearchType(value);
    if(value === 'gene'){
      dispatch({type: ActionTypes.SetByGene})
    } else if (value === 'drug'){
      dispatch({type: ActionTypes.SetByDrug})
    } else if (value === 'categories'){
      dispatch({type: ActionTypes.SetGeneCategories})
    }
  };

  const handleInputChange = (event: any) => {
    setTypedSearchTerm(event.target.value as string)
  };

  const handleDemoClick = () => {
    if (searchType === 'gene') {
      setSelectedOptions(
        [{name: 'FLT1'}, {name: 'FLT2'}, {name: 'FLT3'}, {name: 'STK1'}, {name: 'MM1'}, {name: 'AQP1'}, {name: 'LOC100508755'}, {name: 'FAKE1'}]
      )
    } else if (searchType === 'drug') {
      setSelectedOptions(
        [{name: 'SUNITINIB'}, {name: 'ZALCITABINE'}, {name: 'TRASTUZUMAB'}, {name: 'NOTREAL'}]
      )
    } else if (searchType === 'categories') {
      setSelectedOptions(
        [{name: 'HER2'}, {name: 'ERBB2'}, {name: 'PTGDR'}, {name: 'EGFR'}, {name: 'RECK'}, {name: 'KCNMA1'}, {name: 'MM1'}]
      )
    }
  }
  const handleSearchClick = () => {
    state.searchTerms = selectedOptions.map(option => option.name)
    handleSubmit();
  }

  useEffect(() => {
    // populate tags from state if nothing entered
    if (selectedOptions?.length !== 0) {
      selectedOptions.map(option => {
        dispatch({type: ActionTypes.AddTerm, payload: option.name})
      });
    // populate 
    } else if (state.searchTerms?.length > 0 && selectedOptions?.length === 0) {
      setSelectedOptions(state.searchTerms.map(option => {return {name: option}}))
    }
  }, [selectedOptions]);

  return (
    <>
    <Box>
    <Box display='flex'>
      <Box>
      <Select value={state.interactionMode || searchType} defaultValue={state.interactionMode || 'gene'} onChange={handleChange} classes={{select: 'search-type-select'}}>
        <MenuItem value='gene'>Interactions by Gene</MenuItem>
        <MenuItem value='drug'>Interactions by Drug</MenuItem>
        <MenuItem value='categories'>Gene Categories</MenuItem>
      </Select>
      </Box>
      <Box display='block' ml={1}>
      <Autocomplete
        multiple
        filterSelectedOptions
        id="tags-standard"
        options={autocompleteOptions}
        getOptionLabel={(option: any) => option.name}
        renderInput={(params) => (
          <Box width={650}>
          <TextField
            {...params}
            variant="standard"
            label="Search Terms"
          />
          </Box>
        )}
        value={selectedOptions}
        onInputChange={handleInputChange}
        onChange={handleAutocompleteChange}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      />
      </Box>
    </Box>
    <Box display='flex' justifyContent='end'>
      <Box mt={1}>
        <Button className='search-buttons' variant='contained' color="primary" onClick={handleDemoClick} style={{marginRight: '10px'}}>Demo</Button>
        <Button className='search-buttons' variant='contained' color="primary" onClick={handleSearchClick}>Search</Button>
      </Box>
    </Box>
    </Box>
    </>
  );
}

type SearchBarProps = {
  handleSubmit: () => void;
};

export default SearchBar;