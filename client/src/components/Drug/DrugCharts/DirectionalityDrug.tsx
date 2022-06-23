// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: any;
}

export const DirectionalityDrug: React.FC<Props> = ({data}) => {
  const [count, setCount] = useState<number[]>([0, 0, 0]);

  const [chartData, setChartData] = useState<any>({
    labels: ['Activating', 'Inhibiting', 'N/A'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#480A77', '#8075FF', '#89E8F1', '#FA198B', '#4BC6B9', '#F0EFF4', '#D1CFE2', '#BAA898'],
      }
    ]
  });

  const options = {
    height: 500,
    responsive: true,
  }

  const labels = ['Activating', 'Inhibiting', 'N/A'];

  useEffect(() => {
    let countCopy = [0, 0, 0];
    data?.forEach((drug: any) => {
      drug?.interactions?.forEach((int: any) => {
        if (!int.interactionTypes.length) {
          countCopy[2] = count[2]++
        } else {
          int.interactionTypes.forEach((type: any) => {
            if(type.directionality === 'INHIBITORY') {
              countCopy[1] = count[1]++
            } else {
              countCopy[0] = count[0]++
            }
          })
        }
        setCount(countCopy)
        setChartData({
          labels: ['Activating', 'Inhibiting', 'N/A'],
          datasets: [
            {
              data: countCopy,
              backgroundColor: ['#480A77', '#8075FF', '#89E8F1', '#FA198B', '#4BC6B9', '#F0EFF4', '#D1CFE2', '#BAA898'],
            }
          ]
        })
      })
    })
  }, [data])

  return (
    <div className="pie-chart-container">
      <Pie options={options} data={chartData} />
    </div>
  )
}




