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
  const {state} = useContext(GlobalClientContext);
  const { data } = useGetInteractionsByGenes(state.searchTerms);

  const [chartData, setChartData] = useState<any>({
    labels: ['inhibitor', 'antagonist', 'antibody', 'agonist'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [0, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Interaction Type (PDGFRA)',
      },
    },
  };

  const labels = ['inhibitor', 'antagonist', 'antibody', 'agonist'];


  useEffect(() => {
    if (data?.genes?.length) {
      data.genes.forEach((gene: any) => {
        let myArray = [0, 0, 0, 0]

        gene.interactions.forEach((int: any) => {


          if(int.interactionTypes.length){
            switch(int.interactionTypes[0].type){
              case 'inhibitor':
                myArray[0]++;
                break;
              case 'antagonist':
                myArray[1]++;
                break;
              case 'antibody':
                myArray[2]++;
                break;
              case 'agonist':
                myArray[3]++;
                break;
              default:
                return;
            }
          }
        })

        setChartData({
          labels,
          datasets: [
            {
              label: 'Dataset 1',
              data: myArray,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
          ]
        });
      })
    }
  }, [data])

  return (
    <div className="summary-infographic-container">
      <h4>Summary Infographics</h4>

      <Bar
        options={options}
        data={chartData}
      />
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
