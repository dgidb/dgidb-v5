// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';


// styles
import './results.page.scss';
import { InteractionTable } from 'components/Interaction Table';
import { GeneSummary } from 'components/Gene Summary';



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
      Drug page. 
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
