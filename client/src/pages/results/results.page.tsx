// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useGetInteractionsByDrugs, useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';

// components
import { InteractionTable } from 'components/Interaction Table';
import { GeneSummary } from 'components/Gene Summary';

// styles
import './results.page.scss';
import { Skeleton } from 'antd';
import { DrugSummary } from '../../components/Drug Summary/DrugSummary';

// const { Paragraph } = Skeleton;


const GeneResults: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const {data, isError, isLoading } = useGetInteractionsByGenes(state.searchTerms)

  if (isError) {
    return (
      <>
        Error!
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Skeleton active paragraph={{rows: 10}}/>
      </>
    )
  }

  if (data) {
    return (
      <>
        <GeneSummary />
        <InteractionTable />
      </>
    )
  }

  return (
    <div>Something is broken (no query conditions apply)</div>
  )
}

const DrugResults: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const {data, isError, isLoading } = useGetInteractionsByDrugs(state.searchTerms)

  if (isError) {
    return (
      <>
        Error!
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Skeleton active paragraph={{rows: 10}}/>
      </>
    )
  }

  if (data) {
    console.log(data);
    return (
      <>
        <DrugSummary />
      </>
    )
  }

  return (
    <>Something is broken (no query conditions apply)</>
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
