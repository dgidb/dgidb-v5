// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

// components
import { GeneSummary } from 'components/Gene/GeneSummary';
import { DrugSummary } from 'components/Drug/DrugSummary';
import { CategoryResults } from 'components/Gene/Categories/CategoryResults';
import { AmbiguousTermsSummary } from 'components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary';
import { ActionTypes } from 'stores/Global/reducers';

// styles
import './Results.scss';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const GeneResults: React.FC = () => {
  return (
    <>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Unique Matches" key="1">
          <GeneSummary />
        </TabPane>
        <TabPane tab="Ambiguous or Unmatched" key="2">
          <AmbiguousTermsSummary resultType="gene" />
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
          <AmbiguousTermsSummary resultType="drug"/>
        </TabPane>
      </Tabs>
    </>
  )
}

export const Results: React.FC = () => {
  const {state, dispatch} = useContext(GlobalClientContext);
  const [searchParams] = useSearchParams();
  console.log(searchParams.get('searchTerms')); // 'name'
  // const navigate = useNavigate();

  useEffect(() => {
    if(searchParams && !state.searchTerms.length) {
      const arr = searchParams.get('searchTerms')?.split(',')
      arr?.forEach( term => 
        dispatch({type: ActionTypes.AddTerm, payload: term})
      )
    }
  }, [searchParams])

  return (
    <div className="results-page-container">
      {state.interactionMode === 'gene' && <GeneResults />}
      {state.interactionMode === 'drug' && <DrugResults />}
      {state.interactionMode === 'categories' && <CategoryResults />}
    </div>
  )
};