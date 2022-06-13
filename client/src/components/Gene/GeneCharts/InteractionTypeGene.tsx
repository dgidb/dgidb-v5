// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
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
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

interface Props {
  data: any;
}

export const InteractionTypeGene: React.FC<Props> = ({data}) => {
  const {state} = useContext(GlobalClientContext);
  // const { data } = useGetInteractionsByGenes(state.searchTerms);

  const [chartData, setChartData] = useState<any>({
    labels: ['inhibitor', 'antagonist', 'antibody', 'agonist'],
    datasets: [
      {
        label: '',
        data: [0, 0, 0, 0],
        backgroundColor: ['#480A77', '#8075FF', '#89E8F1', '#FA198B', '#4BC6B9', '#F0EFF4', '#D1CFE2', '#BAA898'],
      }
    ]
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Interaction Type',
      },
    },
  };

  const labels = ['inhibitor', 'antagonist', 'antibody', 'agonist'];

  useEffect(() => {
    if (data?.length) {
      let dataArray = [0, 0, 0, 0]
      data.forEach((gene: any) => {
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

      })
      setChartData({
        labels,
        datasets: [
          {
            label: '',
            data: dataArray,
            backgroundColor: ['#480A77', '#8075FF', '#89E8F1', '#FA198B', '#4BC6B9', '#F0EFF4', '#D1CFE2', '#BAA898']
          }
        ]
      });
    }
  }, [data])

  return (
    <div className="type-container">
      <Bar options={options} data={chartData}/>
    </div>
  )
}