// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './GeneSummary.scss';

const InteractionCount: React.FC = () => {
  return (
    <div className="interaction-count-container">
      <h4>Gene Interactions</h4>
    </div>
  )
}
const SummaryInfo: React.FC = () => {
  return (
    <div className="summary-infographic-container">
      <h4>Summary Infographics</h4>
    </div>
  )
}

export const GeneSummary: React.FC = () => {

  const {state} = useContext(GlobalClientContext);


  const { data, error, isError, isLoading, refetch} = useGetInteractionsByGenes(state.searchTerms);

  if (isError || isLoading) {
    return (
      <div className="gene-summary-container">

      {isError && <div>Error: Interactions not found!</div>}

      {isLoading && <div>Loading...</div>}
      </div>
    )
  }
  return (
    <div className="gene-summary-container">
      <h3>Gene Summary</h3>
      <div className="gene-summary-content">
        <InteractionCount />
        <SummaryInfo />
      </div>
    </div>
  )
};
