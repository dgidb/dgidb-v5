// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { chartColors } from 'config/theme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ApprovalRatings {
  [key: string]: number;
}

interface Props {
  data: any;
}

export const RegulatoryApprovalGene: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: ['Activating', 'Inhibiting', 'N/A'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [0, 0, 0],
        backgroundColor: chartColors,
      },
    ],
  });

  useEffect(() => {
    let newObj: ApprovalRatings = {};

    data?.forEach((gene: any) => {
      gene.interactions?.forEach((int: any) => {
        const rating = int?.drug?.approved ? 'Approved' : 'Not Approved';
        if (newObj[rating]) {
          ++newObj[rating];
        } else {
          newObj[rating] = 1;
        }
      });
    });
    let dataArray = [];
    let labelArray = [];

    for (const key in newObj) {
      dataArray.push(newObj[key]);
      labelArray.push(key);
    }

    setChartData({
      datasets: [
        {
          data: dataArray,
          backgroundColor: chartColors,
        },
      ],
      labels: labelArray,
    });
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 15,
          padding: 8,
        },
      },
    },
  };

  return (
    <div className="approval-container">
      <Pie options={options} data={chartData} />
    </div>
  );
};
