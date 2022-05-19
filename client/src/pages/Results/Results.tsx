// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// components
import { GeneSummary } from 'components/Gene/GeneSummary';
import { GeneTable } from 'components/Gene/GeneTable';
import { DrugSummary } from 'components/Drug/DrugSummary';
import { DrugTable } from 'components/Drug/DrugTable';

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
