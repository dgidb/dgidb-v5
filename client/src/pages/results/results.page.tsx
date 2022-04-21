// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// components
import { InteractionTable } from 'components/Results Table/Gene';
import { GeneSummary } from 'components/Results Summary/Gene';

// styles
import './results.page.scss';
import { DrugSummary } from '../../components/Results Summary/Drug/DrugSummary';

const GeneResults: React.FC = () => {
  return (
    <>
      <GeneSummary />
      <InteractionTable />
    </>
  )
}

const DrugResults: React.FC = () => {
  return (
    <>
      <DrugSummary />
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
