import './SearchBar.scss';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useContext, useEffect } from 'react';
import React from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';
import { useGetNameSuggestions } from 'hooks/queries/useGetNameSuggestions';
import { SearchTypes } from 'types/types';

type SearchBarProps = {
  handleSubmit: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ handleSubmit }) => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const [searchType, setSearchType] = React.useState<SearchTypes>(
    state.interactionMode
  );
  const [typedSearchTerm, setTypedSearchTerm] = React.useState('');
  const typeAheadQuery = useGetNameSuggestions(typedSearchTerm, searchType);
  let autocompleteOptions = typeAheadQuery?.data?.geneSuggestions || [];
  const drugAutocompleteOptions = typeAheadQuery?.data?.drugSuggestions || [];

  if (searchType === SearchTypes.Drug) {
    autocompleteOptions = drugAutocompleteOptions;
  }

  // support searching for terms that the API may not return (add user's typed term to options if it's not already there)
  if (
    autocompleteOptions.filter(
      (option: { suggestion: string }) => option.suggestion === typedSearchTerm
    ).length === 0
  ) {
    autocompleteOptions = [
      { suggestion: typedSearchTerm },
      ...autocompleteOptions,
    ];
  }

  const [selectedOptions, setSelectedOptions] = React.useState<any[]>([]);

  const handleAutocompleteChange = (event: any, value: any) => {
    if (value.length === 0) {
      setSelectedOptions([]);
      dispatch({ type: ActionTypes.DeleteAllTerms });
    } else {
      setSelectedOptions(value);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as SearchTypes;
    setSearchType(value);
    if (value === SearchTypes.Gene) {
      dispatch({ type: ActionTypes.SetByGene });
    } else if (value === SearchTypes.Drug) {
      dispatch({ type: ActionTypes.SetByDrug });
    } else if (value === SearchTypes.Categories) {
      dispatch({ type: ActionTypes.SetGeneCategories });
    }
  };

  const handleInputChange = (event: any) => {
    setTypedSearchTerm(event.target.value as string);
  };

  const handleDemoClick = () => {
    if (searchType === SearchTypes.Gene) {
      setSelectedOptions([
        { suggestion: 'FLT1' },
        { suggestion: 'FLT2' },
        { suggestion: 'FLT3' },
        { suggestion: 'STK1' },
        { suggestion: 'MM1' },
        { suggestion: 'AQP1' },
        { suggestion: 'LOC100508755' },
        { suggestion: 'FAKE1' },
      ]);
    } else if (searchType === SearchTypes.Drug) {
      setSelectedOptions([
        { suggestion: 'SUNITINIB' },
        { suggestion: 'ZALCITABINE' },
        { suggestion: 'TRASTUZUMAB' },
        { suggestion: 'NOTREAL' },
      ]);
    } else if (searchType === SearchTypes.Categories) {
      setSelectedOptions([
        { suggestion: 'HER2' },
        { suggestion: 'ERBB2' },
        { suggestion: 'PTGDR' },
        { suggestion: 'EGFR' },
        { suggestion: 'RECK' },
        { suggestion: 'KCNMA1' },
        { suggestion: 'MM1' },
      ]);
    }
  };
  const handleSearchClick = () => {
    state.searchTerms = selectedOptions.map((option) => option.suggestion);
    handleSubmit();
  };

  useEffect(() => {
    // populate tags from state if nothing entered
    if (selectedOptions?.length !== 0) {
      selectedOptions.map((option) => {
        dispatch({ type: ActionTypes.AddTerm, payload: option.suggestion });
      });
      // populate
    } else if (state.searchTerms?.length > 0 && selectedOptions?.length === 0) {
      setSelectedOptions(
        state.searchTerms.map((option) => {
          return { suggestion: option };
        })
      );
    }
  }, [selectedOptions]);

  return (
    <>
      <Box>
        <Box display="flex">
          <Box>
            <Select
              value={state.interactionMode || searchType}
              defaultValue={state.interactionMode || SearchTypes.Gene}
              onChange={handleChange}
              classes={{ select: 'search-type-select' }}
            >
              <MenuItem value={SearchTypes.Gene}>Interactions by Gene</MenuItem>
              <MenuItem value={SearchTypes.Drug}>Interactions by Drug</MenuItem>
              <MenuItem value={SearchTypes.Categories}>
                Gene Categories
              </MenuItem>
            </Select>
          </Box>
          <Box display="block" ml={1}>
            <Autocomplete
              multiple
              filterSelectedOptions
              id="tags-standard"
              options={autocompleteOptions}
              getOptionLabel={(option: any) => option.suggestion}
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
              isOptionEqualToValue={(option, value) =>
                option.suggestion === value.suggestion
              }
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="end">
          <Box mt={1}>
            <Button
              className="search-buttons"
              variant="contained"
              color="primary"
              onClick={handleDemoClick}
              style={{ marginRight: '10px' }}
            >
              Demo
            </Button>
            <Button
              className="search-buttons"
              variant="contained"
              color="primary"
              onClick={handleSearchClick}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SearchBar;
