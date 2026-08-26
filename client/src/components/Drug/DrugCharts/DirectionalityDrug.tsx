// hooks/dependencies
import React, { useState, useEffect } from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DIRECTIONALITY_LABELS, normalizeDirectionalities } from 'utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: any;
}

export const DirectionalityDrug: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: DIRECTIONALITY_LABELS,
    datasets: [
      {
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

  const options = {
    height: 500,
    responsive: true,
  };

  useEffect(() => {
    const directionalityCounts = [0, 0, 0];
    data?.forEach((drug: any) => {
      drug?.interactions?.forEach((int: any) => {
        normalizeDirectionalities(int.interactionTypes).forEach(
          (directionality) => {
            const directionalityIndex =
              DIRECTIONALITY_LABELS.indexOf(directionality);
            directionalityCounts[directionalityIndex]++;
          }
        );
      });
    });
    setChartData({
      labels: DIRECTIONALITY_LABELS,
      datasets: [
        {
          data: directionalityCounts,
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
  }, [data]);

  return (
    <div className="pie-chart-container">
      <Pie options={options} data={chartData} />
    </div>
  );
};
