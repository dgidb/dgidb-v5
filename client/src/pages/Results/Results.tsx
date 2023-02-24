// hooks/dependencies
import React, {useContext, useEffect} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useSearchParams } from 'react-router-dom';

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

  useEffect(() => {
    // if there are no search terms in state, populate from the url search params
    if(searchParams && !state.searchTerms.length) {
      const terms = searchParams.get('searchTerms')?.split(',')
      terms?.forEach( term => 
        dispatch({type: ActionTypes.AddTerm, payload: term})
      )
    }
  }, [searchParams, dispatch, state])

  return (
    <div className="results-page-container">
      {state.interactionMode === 'gene' && <GeneResults />}
      {state.interactionMode === 'drug' && <DrugResults />}
      {state.interactionMode === 'categories' && <CategoryResults />}
    </div>
  )
};