// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetCategories} from 'hooks/queries/useGetCategories';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './CategoryResults.scss';

export const CategoryResults: React.FC = () => {

  const {state } = useContext(GlobalClientContext);

  // TODO: Update useGetCategories query to accept array of strings, also to return sources associated with gene categories
  const { data } = useGetCategories(state.searchTerms);

  return (
    <div className="category-results-container">

    </div>
  )
};
