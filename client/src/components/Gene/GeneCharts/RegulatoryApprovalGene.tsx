// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ApprovalRatings {
  [key: string]: number
}

export const RegulatoryApprovalGene: React.FC = () => {
  const {state} = useContext(GlobalClientContext);

  const [approvalRatings, setApprovalRatings] = useState<any>([]);
  const { data } = useGetInteractionsByGenes(state.searchTerms);

  const [chartData, setChartData] = useState<any>({
    labels: ['Activating', 'Inhibiting', 'N/A'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [67, 32, 21],
        backgroundColor: ['#480A77', '#8075FF', '#89E8F1', '#FA198B', '#4BC6B9', '#F0EFF4', '#D1CFE2', '#BAA898'],
      }
    ]
  });

  let genes = data?.genes;

  useEffect(() => {
    let newObj: ApprovalRatings = {};

    if (genes) {
      genes?.forEach((gene: any) => {
        gene.interactions?.forEach((int: any) => {
          int?.drug?.drugApprovalRatings.forEach((rating: any) => {
            if (newObj[rating.rating]) {
              newObj[rating.rating] += 1;
            } else {
              newObj[rating.rating] = 1;
            }
          })
        })
      })
    }

    //make data array and labels array

    // let approvalRatingsArray = [];
    let dataArray = [];
    let labelArray = []

    for (const key in newObj) {
      dataArray.push(newObj[key])
      labelArray.push(key)
    }

    // setApprovalRatings(approvalRatingsArray);

    setChartData({
      datasets: [
        {
          data: dataArray,
          backgroundColor: ['#480A77', '#8075FF', '#89E8F1', '#FA198B', '#4BC6B9', '#F0EFF4', '#D1CFE2', '#BAA898']
        }
      ],
      labels: labelArray
    });

  }, [data])


  const options = {
    responsive: true,
  }


  return (
    <div className="approval-container">
      <Pie options={options} data={chartData} />
    </div>
  )
}