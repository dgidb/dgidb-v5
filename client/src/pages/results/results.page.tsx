// hooks/dependencies
import React, {useContext} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// components
import { InteractionTable } from 'components/Interaction Table';
import { GeneSummary } from 'components/Gene Summary';

// styles
import './results.page.scss';
import { DrugSummary } from '../../components/Drug Summary/DrugSummary';


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

  return (
      <div className="results-page-container">
        {state.interactionMode === 'gene' && <GeneResults />}
        {state.interactionMode === 'drug' && <DrugResults />}
      </div>
  )
};
