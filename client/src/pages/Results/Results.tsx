import React, { useContext, useEffect } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchTypes } from 'types/types';
import { ActionTypes } from 'stores/Global/reducers';
import { GeneSearchResults } from 'components/Gene/GeneSearchResults/GeneSearchResults';
import { DrugSearchResults } from 'components/Drug/DrugSearchResults/DrugSearchResults';
import { GeneCategoriesSearchResults } from 'components/GeneCategories/GeneCategoriesSearchResults/GeneCategoriesSearchResults';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import './Results.scss';

export const Results: React.FC = () => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerms = searchParams.get('searchTerms')?.split(',');
  const searchType = searchParams.get('searchType') as SearchTypes;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // update search type based on search params
    if (searchParams) {
      if (searchType === SearchTypes.Gene) {
        dispatch({ type: ActionTypes.SetByGene });
      }
      if (searchType === SearchTypes.Drug) {
        dispatch({ type: ActionTypes.SetByDrug });
      } else if (searchType === SearchTypes.Categories) {
        dispatch({ type: ActionTypes.SetGeneCategories });
      }
    }
    // populate search terms based on search params if the params don't match what's in the state
    if (
      searchParams &&
      searchTerms?.toString() !== state?.searchTerms?.toString()
    ) {
      state.searchTerms = [];
      const terms = searchParams.get('searchTerms')?.split(',');
      terms?.forEach((term) =>
        dispatch({ type: ActionTypes.AddTerm, payload: term })
      );
    }
  }, []);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '15px' }}>
        <Link
          underline="hover"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Typography color="text.primary">Search Results</Typography>
      </Breadcrumbs>
      <div className="results-page-container">
        {searchType === SearchTypes.Gene ? (
          <GeneSearchResults value={value} handleChange={handleChange} />
        ) : searchType === SearchTypes.Drug ? (
          <DrugSearchResults value={value} handleChange={handleChange} />
        ) : (
          <GeneCategoriesSearchResults
            value={value}
            handleChange={handleChange}
          />
        )}
      </div>
    </>
  );
};
