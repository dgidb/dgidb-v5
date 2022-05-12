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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export const InteractionGene: React.FC = () => {
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
    maintainAspectRatio: false,
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
        let dataArray = [0, 0, 0, 0]
        gene.interactions.forEach((int: any) => {
          if(int.interactionTypes.length){
            switch(int.interactionTypes[0].type){
              case 'inhibitor':
                dataArray[0]++;
                break;
              case 'antagonist':
                dataArray[1]++;
                break;
              case 'antibody':
                dataArray[2]++;
                break;
              case 'agonist':
                dataArray[3]++;
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
              data: dataArray,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
          ]
        });
      })
    }
  }, [data])

  return <Bar options={options} data={chartData}/>
}