// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { InteractionType } from 'components/Interaction Charts/Gene';
import { InteractionDirectionality } from 'components/Interaction Charts/Gene';
import { InteractionScore } from 'components/Interaction Charts/Gene';
import { RegulatoryApproval } from 'components/Interaction Charts/Gene';


// styles
import './GeneSummary.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InteractionCount: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const { data, isError, isLoading } = useGetInteractionsByGenes(state.searchTerms);
  
  let genes = data?.genes;

  return (
    <div className="interaction-count-container">
      <h4>Gene Interactions</h4>
      <div className="interaction-count-row">
        <div className="interaction-count-gene"><b>Gene</b></div>
        <div className="interaction-count"><b>Interactions</b></div>
      </div>
      {genes?.map((gene: any) => {
        return (
          <div className="interaction-count-row">
            <div className="interaction-count-gene">{gene.name}</div>
            <div className="interaction-count">{gene.interactions.length}</div>
          </div>
          )
      })}
    </div>
  )
}


const SummaryInfo: React.FC = () => {

  const [chartType, setChartType] = useState('score')

  return (
    <div className="summary-infographic-container">
      <h4>Summary Infographics</h4>

      <div className="chart-section">
        <div className="score-container">
          {chartType === 'score' && <InteractionScore />}
        </div>
        <div className="type-container">
          {chartType === 'type' && <InteractionType />}
        </div>
        <div className="directionality-container">
         {chartType === 'directionality' && <InteractionDirectionality />}
        </div>
        <div className="approval-container">
         {chartType === 'approval' && <RegulatoryApproval />}
        </div>
      </div>

      <div className="chart-selector">
        <div onClick={() => setChartType('score')}>Interaction Score</div>
        <div onClick={() => setChartType('type')}>Interaction Types</div>
        <div onClick={() => setChartType('directionality')}>Interaction Directionality</div>
        <div onClick={() => setChartType('approval')}>Regulatory Approval</div>
      </div>
    </div>
  )
}

export const GeneSummary: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const { data, error, isError, isLoading} = useGetInteractionsByGenes(state.searchTerms);

  if (isError || isLoading) {
    return (
      <div className="gene-summary-container">
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    )
  }
  return (
    <div className="gene-summary-container">
      <h3>Gene Summary</h3>
      <div className="gene-summary-content">
        <InteractionCount/>
        <SummaryInfo />
      </div>
    </div>
  )
};
