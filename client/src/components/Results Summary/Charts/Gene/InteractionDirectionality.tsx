// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const InteractionDirectionality: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const { data } = useGetInteractionsByGenes(state.searchTerms);

  const [chartData, setChartData] = useState<any>({
    labels: ['Activating', 'Inhibiting', 'N/A'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [67, 32, 21],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  });

  const options = {
    responsive: true,
  }

  const labels = ['Activating', 'Inhibiting', 'N/A'];

  // useEffect(() => {
  //   if (data?.genes?.length) {
  //     data.genes.forEach((gene: any) => {
  //       let dataArray = [0, 0, 0]
  //       gene.interactions.forEach((int: any) => {
  //           switch(int.interactionTypes[0].directionality){
  //             case 0:
  //               dataArray[0]++;
  //               break;
  //             case 1:
  //               dataArray[1]++;
  //               break;
  //             case null:
  //               dataArray[2]++;
  //               break;
  //             default:
  //               return;
  //           }
  //       })

  //       setChartData({
  //         labels,
  //         datasets: [
  //           {
  //             label: 'Dataset 1',
  //             data: dataArray,
  //             backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //           }
  //         ]
  //       });
  //     })
  //   }
  // }, [data])

  const data2 = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  return <Pie options={options} data={chartData} />
}




