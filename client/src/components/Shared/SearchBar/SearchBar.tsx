import './SearchBar.scss';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { AutocompleteGetTagProps, Box, MenuItem, Select, SelectChangeEvent, useAutocomplete } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

const Root = styled('div')(
  ({ theme }) => `
  color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
  };
  font-size: 14px;
`,
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 300px;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'
    };
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
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
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
  background-color: ${
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'
  };
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
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
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

const SearchBar: React.FC<SearchBarProps> = ({ handleSubmit }) => {
  const [searchType, setSearchType] = React.useState('gene');
  const [typedSearchTerm, setTypedSearchTerm] = React.useState('')
  const { state } = useContext(GlobalClientContext);

  const handleChange = (event: SelectChangeEvent) => {
    setSearchType(event.target.value as string);
  };

  const handleInputChange = (event: any) => {
    console.log(event)
    setTypedSearchTerm(event.target.value as string);
  };

  const isValidSearch = typedSearchTerm && typedSearchTerm !== '' && typedSearchTerm !== ' '

  // get options + add whatever the user is typing
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    multiple: true,
    options: isValidSearch ? [{title: typedSearchTerm}, ...testOptions] : testOptions,
    getOptionLabel: option => typeof option === 'string' ? option : option.title,
    freeSolo: true
  });

  let allOptions = [...groupedOptions]

  console.log(value)

  useEffect(() => {
    state.searchTerms = value.map(option => typeof option === 'string' ? option : option.title)
  }, [value])

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
          <input {...getInputProps()} />
        </InputWrapper>
      {allOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(allOptions as typeof testOptions).map((option, index) => (
            <li {...getOptionProps({ option, index })}>
              <span onClick={() => setTypedSearchTerm(' ')}>{option.title}</span>
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

interface MenuOptionType {
  title: string;
}

const testOptions = [
  { title: 'BRAF' },
  { title: 'MLL' },
  { title: 'HER2' },
  { title: 'FLT3' },
  { title: 'ERBB2' },
]

// const OldSearchBar: React.FC<SearchBarProps> = ({handleSubmit }) => {
//   const {state, dispatch} = useContext(GlobalClientContext);

//   const [inputValue, setInputValue] = useState<any>('');
//   const [options, setOptions] = useState<any>([]);
//   const [showFilters, setShowFilters] = useState(false);
  
//   const { Option } = Select;

//   let content = (
//     <div>
//       <div className="filter-options ">
//         <h5>Preset Filters</h5>
//         <Checkbox>Approved</Checkbox>
//         <Checkbox>Antineoplastic</Checkbox>
//         <Checkbox>Immunotherapies</Checkbox>
//       </div>
//       <div className="filter-options ">
//         <h5>Advanced Filters</h5>
//         <span>Source Databases</span>
//         <Button style={{ width: 80}}>22 of 22</Button>
//         <span>Gene Categories</span>
//         <Button style={{ width: 80}}>43 of 43</Button>
//         <span>Interaction Types</span>
//         <Button style={{ width: 80}}>31 of 31</Button>
//       </div>
//     </div>
//   )

//   const onKeyDown = (value: any) => {

//     let deleteTag = value.key === 'Backspace' && !inputValue.length;
//     let saveTag = (value.key === 'Enter' || value.key === ' ' || value.key === ',') && inputValue.length;
//     let search = value.key === 'Enter' && !inputValue.length && state.searchTerms.length;

//     if (deleteTag) {
//       dispatch({type: ActionTypes.DeleteLastTerm});
//     }
//     else if (saveTag) {
//       dispatch({type: ActionTypes.AddTerm, payload: inputValue})
//       setInputValue('');
//     } 
//     else if (search) {
//       handleSubmit();
//     }
//     return;
//   }
  
//   return (
//   <div className="search-container"> 
//     <div className="search-subcontainer">
//       <div className="search-dropdown">
//         <Select 
//           value={state.interactionMode}
//           style={{ width: 200 }} 
//           size="large"
//           onChange={(value) => {
//             if(value === 'gene'){
//               dispatch({type: ActionTypes.SetByGene})
//             } else if (value === 'drug'){
//               dispatch({type: ActionTypes.SetByDrug})
//             } else if (value === 'categories'){
//               dispatch({type: ActionTypes.SetGeneCategories})
//             }
//           }}
//           dropdownRender={(menu: any) => (
//             <div>
//               {menu}
//             </div>
//           )} 
//         >
//           <Option className="hi4" value="gene">Interactions by Gene</Option>
//           <Option value="drug">Interactions by Drug</Option>
//           <Option value="categories">Gene Categories</Option>
//         </Select>
//       </div>
//       <div className="search-input">
//         <Form.Item>
//           <Select 
//             allowClear
//             size="large" 
//             placeholder="" 
//             mode="tags"
//             tokenSeparators={[',', ' ']}
//             options={options}
//             onInputKeyDown={onKeyDown}
//             value={state.searchTerms}
//             onClear={() => state.searchTerms = []}
//             onDeselect={(val: any) => dispatch({type: ActionTypes.DeleteTerm, payload: val})}
//             // onChange={value => setQueryParams(value)}
//             onSearch={value => setInputValue(value)}
//           >
//             {state.searchTerms}
//           </Select>
//         </Form.Item>

//           <div className="search-filters">
//             <Popover 
//               content={content} 
//               trigger="click" 
//               open={showFilters} 
//               onOpenChange={open => setShowFilters(open)} 
//             >
//               {/* TODO: Reintroduce later
//               <FilterOutlined
//                 style={{ fontSize: '150%', cursor: 'pointer'}}
//               /> */}
//             </Popover>
//           </div>
//         </div>
//       </div>
//   </div>
//   )
// }

export default SearchBar;