// hooks/dependencies
import React, { useState, useEffect, useContext, SetStateAction } from 'react';
import { useGetInteractionsByDrugs } from 'hooks/queries/useGetInteractions';
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

import { InteractionTypeDrug } from 'components/Drug/DrugCharts';
import { DirectionalityDrug } from 'components/Drug/DrugCharts';
import { GeneCategories } from 'components/Drug/DrugCharts';
import { Tab, Tabs } from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';

// styles
import './DrugSummary.scss';
import Box from '@mui/material/Box';
import InteractionTable from 'components/Shared/InteractionTable/InteractionTable';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';

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

const InteractionCountDrug: React.FC<CountProps> = ({ setChartData }) => {
  const { state } = useContext(GlobalClientContext);
  const { data } = useGetInteractionsByDrugs(state.searchTerms);
  const [filterBy, setFilterBy] = useState<string>('');

  let drugs = data?.drugs?.nodes;

  const toggleFilter = (drugName: string) => {
    if (filterBy === drugName) {
      setChartData(drugs);
      setFilterBy('');
    } else {
      let drug = drugs.find(
        (drug: any) => drug.interactions[0]?.drug?.name === drugName
      );
      setChartData([drug]);
      setFilterBy(drugName);
    }
  };

  return (
    <div className='interaction-count-container'>
      <div className='interaction-count-header'>
        <div className='interaction-count-drug'>
          <h2>
            <b>Drug</b>
          </h2>
        </div>
        <h2>
          <b>Interactions</b>
        </h2>
      </div>
      {drugs?.map((drug: any) => {
        return (
          <div
            className={`interaction-count-row ${
              filterBy === drug.interactions[0]?.drug?.name
                ? 'filtered-by'
                : null
            }`}
            onClick={() => toggleFilter(drug.interactions[0]?.drug?.name)}
          >
            <div className='interaction-count-drug'>
              {drug.interactions[0].drug.name}
            </div>
            <div className='interaction-count'>{drug.interactions.length}</div>
          </div>
        );
      })}
    </div>
  );
};

interface InfoProps {
  chartData: any;
}

const SummaryInfoDrug: React.FC<InfoProps> = ({ chartData }) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
      {getWindowSize().innerWidth >= 1550 ? (
      <div className='chart-section'>
        <InteractionTypeDrug data={chartData} />
        <DirectionalityDrug data={chartData} />
        <GeneCategories data={chartData} />
      </div> ) : (
        <div className='chart-section tabbed-view'>
          <Tabs value={value} onChange={handleChange} orientation='vertical' textColor='secondary' indicatorColor='secondary'>
            <Tab label="Interaction Type" />
            <Tab label="Directionality" />
            <Tab label="Categories" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <InteractionTypeDrug data={chartData} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DirectionalityDrug data={chartData} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <GeneCategories data={chartData} />
          </TabPanel>
        </div>
      )}

    </div>
  );
};

interface SummaryProps {
  conceptIds: string[]
}

export const DrugSummary: React.FC<SummaryProps> = ({ conceptIds }) => {
  const { state } = useContext(GlobalClientContext);
  const { data, error, isError, isLoading } = useGetInteractionsByDrugs(
    state.searchTerms
  );

  const drugs = data?.drugs?.nodes

  const [chartData, setChartData] = useState<any>([]);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  useEffect(() => {
    let interactionData: any = [];
    drugs?.forEach((drug: any) => {
      drug.interactions.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setInteractionResults(interactionData)
  }, [drugs])

  useEffect(() => {
    setChartData(drugs);
  }, [data]);

  if (isError || isLoading) {
    return (
      <div className='drug-summary-container'>
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    );
  }
  if (!isLoading && drugs?.length === 0) {
    return (
      <Box className='no-results-message'><h3>None of your search terms returned <em>unique</em> matches.</h3></Box>
    )
  }
  return (
    <div className='drug-summary-container'>
      <h1>Drug Summary</h1>
      <div className='drug-summary-content'>
        <InteractionCountDrug setChartData={setChartData} />
        <SummaryInfoDrug chartData={chartData} />
      </div>
      <Box display='flex' mt={2} alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <h1>Interaction Results</h1>
          <Box id='interaction-count' ml={2}>{interactionResults.length} total interactions</Box>
        </Box>
        <TableDownloader tableName='drug_interaction_results' vars={{names: state.searchTerms}}/>
      </Box>
      <InteractionTable interactionResults={interactionResults} isLoading={isLoading} />
    </div>
  );
};
