// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// components
import { GeneSummary } from 'components/InteractionSummary/Gene';
import { GeneTable } from 'components/InteractionTable/Gene';
import { DrugSummary } from 'components/InteractionSummary/Drug/DrugSummary';
import { DrugTable } from 'components/InteractionTable/Drug/DrugTable';

// styles
import './Results.scss';

const GeneResults: React.FC = () => {
  return (
    <>
      <GeneSummary />
      <GeneTable />
    </>
  )
}

const DrugResults: React.FC = () => {
  return (
    <>
      <DrugSummary />
      <DrugTable />
    </>
  )
}

export const Results: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!state.searchTerms.length) {
      navigate('/home');
    }
  }, [])

  return (
    <div className="results-page-container">
      {state.interactionMode === 'gene' && <GeneResults />}
      {state.interactionMode === 'drug' && <DrugResults />}
    </div>
  )
};
