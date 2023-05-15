// hooks/dependencies
import React, { useState, useEffect, useContext, SetStateAction } from 'react';
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

import { InteractionTypeGene } from 'components/Gene/GeneCharts';
import { DirectionalityGene } from 'components/Gene/GeneCharts';

// styles
import './GeneSummary.scss';
import { RegulatoryApprovalGene } from 'components/Gene/GeneCharts';
import { Tabs } from 'antd';
import Box from '@mui/material/Box';
import InteractionTable from 'components/Shared/InteractionTable/InteractionTable';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
const { TabPane } = Tabs;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountProps {
  setChartData: React.Dispatch<SetStateAction<any[]>>;
}

const InteractionCount: React.FC<CountProps> = ({ setChartData }) => {
  const { state } = useContext(GlobalClientContext);
  const { data } = useGetInteractionsByGenes(state.searchTerms);
  const [filterBy, setFilterBy] = useState<string>('');

  let genes = data?.genes?.nodes;

  const toggleFilter = (geneName: string) => {
    if (filterBy === geneName) {
      setChartData(genes);
      setFilterBy('');
    } else {
      let gene = genes.find((gene: any) => gene.name === geneName);
      setChartData([gene]);
      setFilterBy(geneName);
    }
  };

  return (
    <div className='interaction-count-container'>
      <div className='interaction-count-header'>
        <div className='interaction-count-gene'>
          <h2>
            <b>Gene</b>
          </h2>
        </div>
        <div className='interaction-count'>
          <h2>
            <b>Interactions</b>
          </h2>
        </div>
      </div>
      {genes?.map((gene: any, i: number) => {
        return (
          <div
            className={`interaction-count-row ${
              filterBy === gene.name ? 'filtered-by' : null
            }`}
            onClick={() => toggleFilter(gene.name)}
            key={i}
          >
            <div className='interaction-count-gene'>{gene.name}</div>
            <div className='interaction-count'>{gene.interactions.length}</div>
          </div>
        );
      })}
    </div>
  );
};

interface InfoProps {
  chartData: any;
}

const SummaryInfo: React.FC<InfoProps> = ({ chartData }) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  return (
    <div className='summary-infographic-container'>
      <h2>Infographics</h2>
      {getWindowSize().innerWidth >= 1580 ? (
        <div className='chart-section'>
          <InteractionTypeGene data={chartData} />
          <DirectionalityGene data={chartData} />
          <RegulatoryApprovalGene data={chartData} />
        </div>
      ) : (
        <div className='chart-section tabbed-view'>
          <Tabs defaultActiveKey='1' type='card' tabPosition='left'>
            <TabPane tab='Interaction Type' key='1'>
              <InteractionTypeGene data={chartData} />
            </TabPane>
            <TabPane tab='Directionality' key='2'>
              <DirectionalityGene data={chartData} />
            </TabPane>
            <TabPane tab='Regulatory Approval' key='3'>
              <RegulatoryApprovalGene data={chartData} />
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export const GeneSummary: React.FC = () => {
  const { state } = useContext(GlobalClientContext);
  const { data, isError, isLoading } = useGetInteractionsByGenes(
    state.searchTerms
  );
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>([]);
  const genes = data?.genes?.nodes

  useEffect(() => {
    let interactionData: any = [];
      genes?.forEach((gene: any) => {
        gene.interactions.forEach((int: any) => {
          interactionData.push(int)
        })
      })
    setInteractionResults(interactionData)
  }, [genes])

  useEffect(() => {
    setChartData(genes);
  }, [data]);

  if (isError || isLoading) {
    return (
      <div className='gene-summary-container'>
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    );
  }
  if (!isLoading && genes?.length === 0) {
    return (
      <Box className='no-results-message'><h3>None of your search terms returned <em>unique</em> matches.</h3></Box>
    )
  }

  return (
    <div className='gene-summary-container'>
      <h1>Gene Summary</h1>
      <div className='gene-summary-content'>
        <InteractionCount setChartData={setChartData} />
        <SummaryInfo chartData={chartData} />
      </div>
      <Box display='flex' mt={2} alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <h1>Interaction Results</h1>
          <Box id='interaction-count' ml={2}>{interactionResults.length} total interactions</Box>
        </Box>
        <TableDownloader tableName='gene_interaction_results' vars={{names: state.searchTerms}}/>
      </Box>
      <InteractionTable interactionResults={interactionResults} isLoading={isLoading} />
    </div>
  );
};
