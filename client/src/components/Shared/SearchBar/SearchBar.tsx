import './SearchBar.scss';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { AutocompleteGetTagProps, Box, MenuItem, Select, SelectChangeEvent, useAutocomplete } from '@mui/material';
import { useContext } from 'react';
import React from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';

// todo: this should be reactive and not a hardcoded width. The colors will also need adjusted if/when dark mode is implemented
const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 600px;
  min-width: 200px;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: var(--theme-primary);
  }

  &.focused {
    border-color: var(--theme-primary);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: var(--background);
    color: var(--soft-background);
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function Tag(props: TagProps) {
  const { dispatch } = useContext(GlobalClientContext);
  const { label, onDelete, ...other } = props;
  const handleDelete = () => {
    dispatch({type: ActionTypes.DeleteTerm, payload: label})
  }
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={(e) => {onDelete(e); handleDelete();}} />
    </div>
  );
}

const StyledTag = styled(Tag)<TagProps>(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: var(--soft-background);
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: var(--theme-primary);
    background-color: var(--logo-gradient-2);
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
  }
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: var(--background);
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: var(--soft-background);
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: var(--soft-background);
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

const SearchBar: React.FC<SearchBarProps> = ({ handleSubmit }) => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const [searchType, setSearchType] = React.useState('gene');
  const [typedSearchTerm, setTypedSearchTerm] = React.useState('')

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
    setTypedSearchTerm(event.target.value as string);
  };

  const isValidSearch = typedSearchTerm && typedSearchTerm !== '' && typedSearchTerm !== ' '

  const {
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'search-autocomplete',
    multiple: true,
    // get options + add whatever the user is typing
    options: isValidSearch ? [{title: typedSearchTerm}, ...testOptions] : testOptions,
    getOptionLabel: option => typeof option === 'string' ? option : option.title,
    freeSolo: true,
    value: state.searchTerms.map(term => { return {title: term}})
  });

  let allOptions = [...groupedOptions]

  return (
    <Box display='flex'>
      <Select value={searchType} defaultValue='gene' onChange={handleChange} classes={{select: 'search-type-select'}}>
        <MenuItem value='gene'>Interactions by Gene</MenuItem>
        <MenuItem value='drug'>Interactions by Drug</MenuItem>
        <MenuItem value='categories'>Gene Categories</MenuItem>
      </Select>
      <Box display='block'>
      <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''} onChange={handleInputChange}>
          {value.map((option: any, index: number) => (
            <StyledTag label={option?.title || option} {...getTagProps({ index })} />
          ))}
          <input {...getInputProps()}/>
        </InputWrapper>
      {allOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(allOptions as typeof testOptions).map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span onClick={() => {setTypedSearchTerm(' '); dispatch({type: ActionTypes.AddTerm, payload: option.title})}}>{option.title}</span>
              <CheckIcon fontSize="small" />
            </li>
          ))}
        </Listbox>
      ) : null}
      </Box>
    </Box>
  );
}

type SearchBarProps = {
  handleSubmit: () => void;
};

const testOptions = [
  { title: 'BRAF' },
  { title: 'MLL' },
  { title: 'HER2' },
  { title: 'FLT3' },
  { title: 'ERBB2' },
]

export default SearchBar;