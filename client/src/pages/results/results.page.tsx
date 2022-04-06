// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';

// styles
import './results.page.scss';
import { InteractionTable } from 'components/Interaction Table';
import { GeneSummary } from 'components/Gene Summary';

export const Results: React.FC = () => {
  return (
      <div className="results-page-container">
        <GeneSummary />
        <InteractionTable />
      </div>
  )
};
