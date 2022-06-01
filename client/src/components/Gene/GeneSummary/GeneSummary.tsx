// hooks/dependencies
import React, {useState, useEffect, useContext, SetStateAction} from 'react';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';
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

import { InteractionTypeGene } from 'components/Gene/GeneCharts';
import { DirectionalityGene } from 'components/Gene/GeneCharts';

// styles
import './GeneSummary.scss';
import { RegulatoryApprovalGene } from 'components/Gene/GeneCharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountProps {
  setChartData: React.Dispatch<SetStateAction<any[]>>
}

const InteractionCount: React.FC<CountProps> = ({setChartData}) => {
  const {state} = useContext(GlobalClientContext);
  const { data } = useGetInteractionsByGenes(state.searchTerms);
  const [filterBy, setFilterBy]= useState<string>('')
  
  let genes = data?.genes;

  const toggleFilter = (geneName: string) => {
    if (filterBy === geneName){
      setChartData(genes)
      setFilterBy('')
    } else {
      let gene = genes.find((gene: any) => gene.name === geneName);
      setChartData([gene]);
      setFilterBy(geneName)
    }
  }

  return (
    <div className="interaction-count-container">
      <div className="interaction-count-header">
        <div className="interaction-count-gene"><b>Gene</b></div>
        <div className="interaction-count"><b>Interactions</b></div>
      </div>
      {genes?.map((gene: any) => {
        return (
          <div className={`interaction-count-row ${filterBy === gene.name ? 'filtered-by' : null}`} onClick={() => toggleFilter(gene.name)}>
            <div className="interaction-count-gene">{gene.name}</div>
            <div className="interaction-count">{gene.interactions.length}</div>
          </div>
          )
      })}
    </div>
  )
}

interface InfoProps {
  chartData: any
}

const SummaryInfo: React.FC<InfoProps> = ({chartData}) => {

  const [chartType, setChartType] = useState('score')

  return (
    <div className="summary-infographic-container">
      <h4>Summary Infographics</h4>

      <div className="chart-section">
        {chartType === 'score' && <InteractionTypeGene data={chartData} />}
        {chartType === 'type' && <InteractionTypeGene data={chartData} />}
        {chartType === 'directionality' && <DirectionalityGene />}
        {chartType === 'approval' && <RegulatoryApprovalGene />}
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
  const { data, isError, isLoading} = useGetInteractionsByGenes(state.searchTerms);
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    setChartData(data?.genes)
  }, [data])

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
        <InteractionCount setChartData={setChartData}/>
        <SummaryInfo chartData={chartData} />
      </div>
    </div>
  )
};
