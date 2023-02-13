// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// components
import { GeneSummary } from 'components/Gene/GeneSummary';
import { DrugSummary } from 'components/Drug/DrugSummary';
import { CategoryResults } from 'components/Gene/Categories/CategoryResults';
import { AmbiguousTermsSummary } from 'components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary';

// styles
import './Results.scss';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const GeneResults: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  return (
    <>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Unique Matches" key="1">
          <GeneSummary />
        </TabPane>
        <TabPane tab="Ambiguous or Unmatched" key="2">
          <AmbiguousTermsSummary />
        </TabPane>
      </Tabs>
    </>
  )
}

const DrugResults: React.FC = () => {
  return (
    <>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Unique Matches" key="1">
          <DrugSummary />
        </TabPane>
        <TabPane tab="Ambiguous or Unmatched" key="2">
          {/* TODO: Add this back once drug ambiguous/unmatched is implemented <AmbiguousTermsSummary /> */}
        </TabPane>
      </Tabs>
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
      {state.interactionMode === 'categories' && <CategoryResults />}
    </div>
  )
};