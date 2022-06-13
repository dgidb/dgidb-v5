// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// components
import { GeneSummary } from 'components/Gene/GeneSummary';
import { GeneIntTable } from 'components/Gene/GeneIntTable';
import { DrugSummary } from 'components/Drug/DrugSummary';
import { DrugTable } from 'components/Drug/DrugTable';
import { CategoryResults } from 'components/Gene/Categories/CategoryResults';

// styles
import './Results.scss';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const onChange = () => {

}

const GeneResults: React.FC = () => {

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChange} type="card">
        <TabPane tab="Unique Matches" key="1">
        <GeneSummary />
          <GeneIntTable />
        </TabPane>
        <TabPane tab="Ambiguous or Unmatched" key="2">
          {/* <GeneSummary />
          <GeneIntTable /> */}
        </TabPane>
      </Tabs>
    </>
  )
}

const DrugResults: React.FC = () => {
  return (
    <>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Unique Matches" key="1">
        <DrugSummary />
          <DrugTable />
        </TabPane>
        <TabPane tab="Ambiguous or Unmatched" key="2">
          <DrugSummary />
          <DrugTable />
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