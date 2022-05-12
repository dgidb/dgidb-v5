// hooks/dependencies
import React, {useState, useEffect, useContext, SetStateAction} from 'react';
import { useGetInteractionsByDrugs } from 'hooks/interactions/useGetInteractions';
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

import { InteractionTypeDrug } from 'components/Drug/DrugCharts'
import { DirectionalityDrug } from 'components/Drug/DrugCharts';
import { InteractionScoreDrug } from 'components/Drug/DrugCharts';
import { RegulatoryApprovalDrug } from 'components/Drug/DrugCharts';


// styles
import './DrugSummary.scss';

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

const DrugInteractionCount: React.FC<CountProps> = ({setChartData}) => {
  const {state} = useContext(GlobalClientContext);
  const { data, isError, isLoading } = useGetInteractionsByDrugs(state.searchTerms);
  const [filterBy, setFilterBy]= useState<string>('')

  let drugs = data?.drugs;

  const toggleFilter = (drugName: string) => {
    if (filterBy === drugName){
      setChartData(drugs)
      setFilterBy('')
    } else {
      let drug = drugs.find((drug: any) => drug.name === drugName);
      setChartData([drug]);
      setFilterBy(drugName)
    }
  }

  return (
    <div className="interaction-count-container">
      <div className="interaction-count-header">
        <div className="interaction-count-drug"><b>drug</b></div>
        <div className="interaction-count"><b>Interactions</b></div>
      </div>
      {drugs?.map((drug: any) => {
        return (
          <div className={`interaction-count-row ${filterBy === drug.name ? 'filtered-by' : null}`} onClick={() => toggleFilter(drug.name)}>
            <div className="interaction-count-drug">{drug.name}</div>
            <div className="interaction-count">{drug.interactions.length}</div>
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
        {chartType === 'score' && <InteractionTypeDrug data={chartData} />}
        {chartType === 'type' && <InteractionTypeDrug data={chartData} />}
        {chartType === 'directionality' && <DirectionalityDrug />}
        {chartType === 'approval' && <InteractionTypeDrug data={chartData} />}
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

export const DrugSummary: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const { data, error, isError, isLoading} = useGetInteractionsByDrugs(state.searchTerms);
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    setChartData(data?.drugs)
  }, [data])

  if (isError || isLoading) {
    return (
      <div className="drug-summary-container">
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    )
  }
  return (
    <div className="drug-summary-container">
      <h3>drug Summary</h3>
      <div className="drug-summary-content">
        <DrugInteractionCount setChartData={setChartData}/>
        <SummaryInfo chartData={chartData} />
      </div>
    </div>
  )
};
