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
  const searchTerms = searchParams.get('searchTerms')?.split(',')

  useEffect(() => {
    // update search type based on search params
    if (searchParams) {
      const searchType = searchParams.get('searchType')
      if (searchType === 'gene') {
        dispatch({type: ActionTypes.SetByGene});
      }
      if (searchType === 'drug') {
        dispatch({type: ActionTypes.SetByDrug});
      }
      else if (searchType === 'categories'){
        dispatch({type: ActionTypes.SetGeneCategories})
      }
    }
    // populate search terms based on search params if the params don't match what's in the state
    if (searchParams && searchTerms?.toString() !== state?.searchTerms?.toString()) {
      state.searchTerms = []
      const terms = searchParams.get('searchTerms')?.split(',')
      terms?.forEach( term => 
        dispatch({type: ActionTypes.AddTerm, payload: term})
      )
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