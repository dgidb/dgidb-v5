// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './GeneSummary.scss';

export const GeneSummary: React.FC = () => {

  const {state} = useContext(GlobalClientContext);


  const { data, error, isError, isLoading, refetch} = useGetInteractionsByGenes(state.searchTerms);

  if (isError) {
    return <div className="gene-summary-container">Error: Interaction not found!</div>
  }

  if (isLoading) {
    return <div className="gene-summary-container">Loading</div>
  }

  return (
    <div className="gene-summary-container">
      <h3>Gene Summary</h3>

    </div>
  )
};
