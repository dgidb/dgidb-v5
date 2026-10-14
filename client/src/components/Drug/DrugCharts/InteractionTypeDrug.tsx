// hooks/dependencies
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { chartColors } from 'config/theme';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface Props {
  data: any;
}

const labels = ['inhibitor', 'antagonist', 'antibody', 'agonist'];

export const InteractionTypeDrug: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: ['inhibitor', 'antagonist', 'antibody', 'agonist'],
    datasets: [
      {
        label: '',
        data: [0, 0, 0, 0],
        backgroundColor: chartColors,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Interaction Type',
      },
    },
  };

  useEffect(() => {
    if (data?.length) {
      let dataArray = [0, 0, 0, 0];
      data.forEach((drug: any) => {
        drug.interactions.forEach((int: any) => {
          if (int.interactionTypes.length) {
            switch (int.interactionTypes[0].type) {
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
        });
      });
      setChartData({
        labels,
        datasets: [
          {
            label: '',
            data: dataArray,
            backgroundColor: chartColors,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="type-container">
      <Bar options={options} data={chartData} />
    </div>
  );
};
