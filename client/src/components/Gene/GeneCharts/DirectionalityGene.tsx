// hooks/dependencies
import React, { useState, useEffect } from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DIRECTIONALITY_LABELS, normalizeDirectionalities } from 'utils/format';
import { chartColors } from 'config/theme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: any;
}

export const DirectionalityGene: React.FC<Props> = ({ data }) => {
  const [chartData, setChartData] = useState<any>({
    labels: DIRECTIONALITY_LABELS,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: chartColors,
      },
    ],
  });

  const options = {
    height: 500,
    responsive: true,
  };

  useEffect(() => {
    const directionalityCounts = [0, 0, 0];
    data?.forEach((gene: any) => {
      gene?.interactions?.forEach((int: any) => {
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
          backgroundColor: chartColors,
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
