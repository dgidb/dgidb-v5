import React, { useContext, useEffect } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useSearchParams } from 'react-router-dom';
import { SearchTypes } from 'types/types';
import { ActionTypes } from 'stores/Global/reducers';
import { GeneSearchResults } from 'components/Gene/GeneSearchResults/GeneSearchResults';
import { DrugSearchResults } from 'components/Drug/DrugSearchResults/DrugSearchResults';
import { GeneCategoriesSearchResults } from 'components/GeneCategories/GeneCategoriesSearchResults/GeneCategoriesSearchResults';

export const Results: React.FC = () => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const [searchParams] = useSearchParams();
  const searchTermsParam = searchParams.get('searchTerms') ?? '';
  const searchType = searchParams.get('searchType') as SearchTypes;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // update search type based on search params
    if (searchType !== state.interactionMode) {
      switch (searchType) {
        case SearchTypes.Gene:
          dispatch({ type: ActionTypes.SetByGene });
          break;
        case SearchTypes.Drug:
          dispatch({ type: ActionTypes.SetByDrug });
          break;
        case SearchTypes.Categories:
          dispatch({ type: ActionTypes.SetGeneCategories });
          break;
      }
    }

    // populate search terms based on search params if the params don't match what's in the state
    if (searchTermsParam !== state.searchTerms.join(',')) {
      dispatch({
        type: ActionTypes.SetTerms,
        payload: searchTermsParam ? searchTermsParam.split(',') : [],
      });
    }
  }, [
    dispatch,
    searchTermsParam,
    searchType,
    state.interactionMode,
    state.searchTerms,
  ]);

  return (
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
  );
};
