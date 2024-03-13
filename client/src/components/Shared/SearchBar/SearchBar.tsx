import './SearchBar.scss';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from '@mui/material';
import { useContext, useEffect } from 'react';
import React from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';
import { useGetNameSuggestions } from 'hooks/queries/useGetNameSuggestions';
import { SearchTypes } from 'types/types';
import { useGetIsMobile } from 'hooks/shared/useGetIsMobile';
import HelpIcon from '@mui/icons-material/Help';

enum DelimiterTypes {
  Comma = 'Comma',
  CommaSpace = 'Comma With Space',
  TabNewline = 'Tab or Newline',
}

type SearchBarProps = {
  handleSubmit: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ handleSubmit }) => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const isMobile = useGetIsMobile();
  const [searchType, setSearchType] = React.useState<SearchTypes>(
    state.interactionMode
  );
  const [typedSearchTerm, setTypedSearchTerm] = React.useState('');
  const [pastingFromDocument, setPastingFromDocument] = React.useState(false);
  const [pastedSearchDelimiter, setPastedSearchDelimiter] = React.useState('');
  const [searchWasPasted, setSearchWasPasted] = React.useState(false);

  const typeAheadQuery = useGetNameSuggestions(typedSearchTerm, searchType);
  let autocompleteOptions = typeAheadQuery?.data?.geneSuggestions || [];
  const drugAutocompleteOptions = typeAheadQuery?.data?.drugSuggestions || [];

  if (searchType === SearchTypes.Drug) {
    autocompleteOptions = drugAutocompleteOptions;
  }

  // support searching for terms that the API may not return (add user's typed term to options if it's not already there)
  if (
    typedSearchTerm &&
    autocompleteOptions.filter(
      (option: { suggestion: string }) => option.suggestion === typedSearchTerm
    ).length === 0 &&
    typedSearchTerm.trim() !== ''
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
      // for clearing the paste warning, if applicable
      setSearchWasPasted(false)
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
      const geneDemoList = [
        'FLT1',
        'FLT2',
        'FLT3',
        'STK1',
        'MM1',
        'AQP1',
        'LOC100508755',
        'FAKE1',
      ];
      setSelectedOptions(convertToDropdownOptions(geneDemoList));
    } else if (searchType === SearchTypes.Drug) {
      const drugDemoList = [
        'SUNITINIB',
        'ZALCITABINE',
        'TRASTUZUMAB',
        'NOTREAL',
      ];
      setSelectedOptions(convertToDropdownOptions(drugDemoList));
    } else if (searchType === SearchTypes.Categories) {
      const categoriesDemoList = [
        'HER2',
        'ERBB2',
        'PTGDR',
        'EGFR',
        'RECK',
        'KCNMA1',
        'MM1',
      ];
      setSelectedOptions(convertToDropdownOptions(categoriesDemoList));
    }
  };
  const handleSearchClick = () => {
    if (selectedOptions?.length === 0) {
      return;
    }
    state.searchTerms = selectedOptions.map((option) => option.suggestion);
    handleSubmit();
  };

  useEffect(() => {
    // populate tags from state if nothing entered
    if (state.searchTerms?.length > 0 && selectedOptions?.length === 0) {
      setSelectedOptions(
        // extra security to ensure no duplicates are displayed
        [...new Set(state.searchTerms)].map((option) => {
          return { suggestion: option };
        })
      );
    }
  }, [selectedOptions]);

  const convertToDropdownOptions = (options: string[]) => {
    return options.map((item: string) => {
      return { suggestion: item.trim() };
    });
  };

  const handlePaste = (event: any) => {
    let pastedText = event.clipboardData.getData('text');
    let pastedOptions: any[] = convertToDropdownOptions([pastedText]);

    const commaSepOptions = pastedText.split(',');

    if (pastedSearchDelimiter === DelimiterTypes.Comma) {
      pastedOptions = convertToDropdownOptions(commaSepOptions);
    } else if (pastedSearchDelimiter === DelimiterTypes.CommaSpace) {
      const commaSpaceSepOptions = pastedText.split(', ');
      pastedOptions = convertToDropdownOptions(commaSpaceSepOptions);
    } else if (pastedSearchDelimiter === DelimiterTypes.TabNewline) {
      const whitespaceRegex = /[\t\n\r\f\v]/;
      const whitespaceSepOptions = pastedText.split(whitespaceRegex);
      pastedOptions = convertToDropdownOptions(whitespaceSepOptions);
    } else {
      pastedOptions = convertToDropdownOptions(commaSepOptions);
    }
    setSearchWasPasted(true);
    // make sure we persist the search terms already entered, combine any pre-existing search terms with the new pasted options
    const newSearchOptions = selectedOptions.concat(pastedOptions);
    // remove any duplicated terms (need to iterate through only the terms since objects are never equivalent in js, even if the contents are the same)
    const uniqueSearchTerms = [
      ...new Set(newSearchOptions.map((option) => option.suggestion)),
    ];
    setSelectedOptions(convertToDropdownOptions(uniqueSearchTerms));
    // we don't want the code to also run what's in onInputChange for the Autocomplete since everything is handled here
    event.preventDefault();
  };

  const handleCheckboxSelect = (event: any) => {
    setPastingFromDocument(event.target.checked);
    // reset the selected delimiter and searchWasPasted, to avoid potential weird behaviors if a user deselects the checkbox
    setPastedSearchDelimiter('');
    setSearchWasPasted(false);
  };

  const handleDelimiterChange = (event: any) => {
    setPastedSearchDelimiter(event.target.value as string);
  };

  const pasteAlert =
    searchWasPasted && pastedSearchDelimiter === '' ? (
      <Box width="100%" pb={2}>
        <Alert severity="info">
          <AlertTitle>Verify your search terms</AlertTitle>
          <p>
            It looks like you pasted search terms. We have defaulted the
            delimiter to comma-separated terms.
          </p>
          <p style={{ marginTop: '10px' }}>
            If this is incorrect or you would like to use a different delimiter,
            make sure to check the “Bulk search” option below and select a
            delimiter from the drop down.
          </p>
        </Alert>
      </Box>
    ) : (
      <></>
    );

  return (
    <>
      <Box id="search-bar-container" width={isMobile ? '95%' : '75%'}>
        {pasteAlert}
        <Box display="flex" flexWrap={isMobile ? 'wrap' : 'nowrap'}>
          <Box width={isMobile ? '100%' : 'fit-content'}>
            <Select
              value={state.interactionMode || searchType}
              defaultValue={state.interactionMode || SearchTypes.Gene}
              onChange={handleChange}
              classes={{ select: 'search-type-select' }}
              fullWidth={isMobile}
            >
              <MenuItem value={SearchTypes.Gene}>Interactions by Gene</MenuItem>
              <MenuItem value={SearchTypes.Drug}>Interactions by Drug</MenuItem>
              <MenuItem value={SearchTypes.Categories}>
                Gene Categories
              </MenuItem>
            </Select>
          </Box>
          <Box display="block" ml={1} width="100%" mt={isMobile ? 2 : 0}>
            <Autocomplete
              multiple
              filterSelectedOptions
              id="tags-standard"
              options={autocompleteOptions}
              getOptionLabel={(option: any) => option.suggestion}
              renderInput={(params) => (
                <Box>
                  <TextField
                    {...params}
                    onPaste={handlePaste}
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
        <Box
          display="flex"
          pt={5}
          flexWrap="wrap"
          height="100px"
          alignContent="center"
        >
          <Tooltip title="Select this option if you are pasting terms from an external document">
            <FormControlLabel
              checked={pastingFromDocument}
              onChange={handleCheckboxSelect}
              control={<Checkbox />}
              label="Bulk search"
            />
          </Tooltip>
          <Box
            width={isMobile ? '100%' : '35%'}
            display={pastingFromDocument ? '' : 'none'}
          >
            <FormControl fullWidth>
              <InputLabel id="delimiter-select-label">
                Select delimiter
              </InputLabel>
              <Select
                labelId="delimiter-select-label"
                id="delimiter-select"
                value={pastedSearchDelimiter}
                label="Select delimiter"
                onChange={handleDelimiterChange}
              >
                <MenuItem value={DelimiterTypes.Comma}>
                  {DelimiterTypes.Comma}
                </MenuItem>
                <MenuItem value={DelimiterTypes.CommaSpace}>
                  {DelimiterTypes.CommaSpace}
                </MenuItem>
                <MenuItem value={DelimiterTypes.TabNewline}>
                  {DelimiterTypes.TabNewline}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SearchBar;
