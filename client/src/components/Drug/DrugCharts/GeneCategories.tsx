// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { getHighestValues } from 'utils/getHighestValues';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ApprovalRatings {
  [key: string]: number;
}

interface Props {
  data: any;
}

export const GeneCategories: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: ['Activating', 'Inhibiting', 'N/A'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [0, 0, 0],
        backgroundColor: [
          '#480A77',
          '#8075FF',
          '#89E8F1',
          '#FA198B',
          '#4BC6B9',
          '#F0EFF4',
          '#D1CFE2',
          '#BAA898',
        ],
      },
    ],
  });

  useEffect(() => {
    let newObj: ApprovalRatings = {};

    data?.forEach((drug: any) => {
      drug?.interactions?.forEach((int: any) => {
        int.gene.geneCategories.forEach((cat: any) => {
          if (newObj[cat.name]) {
            ++newObj[cat.name];
          } else {
            newObj[cat.name] = 1;
          }
        });
      });
    });

    let maxLegend = Math.min(Object.values(newObj).length, 8);

    let firstTen = getHighestValues(newObj, maxLegend);

    let dataArray = [];
    let labelArray = [];

    for (const key in firstTen) {
      dataArray.push(firstTen[key]);
      labelArray.push(key);
    }

    setChartData({
      datasets: [
        {
          data: dataArray,
          backgroundColor: [
            '#480A77',
            '#8075FF',
            '#89E8F1',
            '#FA198B',
            '#4BC6B9',
            '#F0EFF4',
            '#D1CFE2',
            '#BAA898',
          ],
        },
      ],
      labels: labelArray,
    });
  }, [data]);

  const options = {
    responsive: true,
    height: 200,
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
    <div className="gene-categories-container">
      <Pie options={options} data={chartData} />
    </div>
  );
};
