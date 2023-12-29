// hooks/dependencies
import React, { useState, useEffect } from 'react';
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
import { Alert, IconButton, Tab, Tabs } from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';

// styles
import './DrugSummary.scss';
import Box from '@mui/material/Box';
import InteractionTable from 'components/Shared/InteractionTable/InteractionTable';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
import CloseIcon from '@mui/icons-material/Close';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountProps {
  drugMatches: any[];
  selectedDrugs: string[];
  setSelectedDrugs: any;
}

const InteractionCountDrug: React.FC<CountProps> = ({
  drugMatches,
  selectedDrugs,
  setSelectedDrugs,
}) => {
  const [hideAlert, setHideAlert] = React.useState(
    window.localStorage.getItem('interaction-filter-tip-alert')
  );
  const handleCloseAlertTip = () => {
    setHideAlert('true');
    window.localStorage.setItem('interaction-filter-tip-alert', 'true');
  };
  const toggleFilter = (drugName: string) => {
    if (selectedDrugs.includes(drugName)) {
      setSelectedDrugs(
        selectedDrugs.filter((drug: string) => drug !== drugName)
      );
    } else {
      setSelectedDrugs([drugName, ...selectedDrugs]);
    }
  };

  return (
    <div className="interaction-count-container">
      {!hideAlert && (
        <Alert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlertTip}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          You can filter by selecting the rows below
        </Alert>
      )}
      <div className="interaction-count-header">
        <div className="interaction-count-drug">
          <h2>
            <b>Drug</b>
          </h2>
        </div>
        <h2>
          <b>Interactions</b>
        </h2>
      </div>
      {drugMatches?.map((drug: any, i: number) => {
        return (
          <div
            className={`interaction-count-row ${
              selectedDrugs.includes(drug.name) ? 'filtered-by' : null
            }`}
            onClick={() => toggleFilter(drug.name)}
            key={i}
          >
            <div className="interaction-count-drug">{drug.name}</div>
            <div className="interaction-count">{drug.interactions?.length}</div>
          </div>
        );
      })}
    </div>
  );
};

interface InfoProps {
  drugMatches: any;
  selectedDrugs: string[];
}

const SummaryInfoDrug: React.FC<InfoProps> = ({
  drugMatches,
  selectedDrugs,
}) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [value, setValue] = useState(0);

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

  const filteredDrugMatches =
    selectedDrugs.length === 0
      ? drugMatches
      : drugMatches.filter((drugMatch: any) =>
          selectedDrugs.includes(drugMatch.name)
        );

  return (
    <div className="summary-infographic-container">
      <h2>Infographics</h2>
      {getWindowSize().innerWidth >= 1550 ? (
        <div className="chart-section">
          <InteractionTypeDrug data={filteredDrugMatches} />
          <DirectionalityDrug data={filteredDrugMatches} />
          <GeneCategories data={filteredDrugMatches} />
        </div>
      ) : (
        <div className="chart-section tabbed-view">
          <Tabs
            value={value}
            onChange={handleChange}
            orientation="vertical"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Interaction Type" />
            <Tab label="Directionality" />
            <Tab label="Categories" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <InteractionTypeDrug data={filteredDrugMatches} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DirectionalityDrug data={filteredDrugMatches} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <GeneCategories data={filteredDrugMatches} />
          </TabPanel>
        </div>
      )}
    </div>
  );
};

interface SummaryProps {
  drugs: any[];
  isLoading: boolean;
}

export const DrugSummary: React.FC<SummaryProps> = ({ drugs, isLoading }) => {
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [displayedInteractionResults, setDisplayedInteractionResults] =
    useState<any[]>([]);

  useEffect(() => {
    let interactions: any[] = [];
    drugs?.forEach((drug: any) => {
      drug?.matches[0].interactions?.forEach((interaction: any) => {
        interactions.push({
          term: drug.searchTerm,
          drug: {
            approved: drug.matches[0].approved,
            name: drug.matches[0].name,
            conceptId: drug.matches[0].conceptId,
            drugAttributes: drug.matches[0].drugAttributes,
          },
          ...interaction,
        });
      });
    });
    setInteractionResults(interactions);
  }, [drugs]);

  useEffect(() => {
    if (selectedDrugs.length === 0) {
      setDisplayedInteractionResults(interactionResults);
    } else {
      setDisplayedInteractionResults(
        interactionResults.filter((interaction: any) =>
          selectedDrugs.includes(interaction.drug.name)
        )
      );
    }
  }, [selectedDrugs, interactionResults]);

  const drugMatches = drugs?.map((drugMatch: any) => drugMatch.matches[0]);

  return (
    <div className="drug-summary-container">
      <h1>Drug Summary</h1>
      <div className="drug-summary-content">
        <InteractionCountDrug
          drugMatches={drugMatches}
          selectedDrugs={selectedDrugs}
          setSelectedDrugs={setSelectedDrugs}
        />
        <SummaryInfoDrug
          drugMatches={drugMatches}
          selectedDrugs={selectedDrugs}
        />
      </div>
      <Box
        display="flex"
        mt={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <h1>Interaction Results</h1>
          <Box id="interaction-count" ml={2}>
            {interactionResults.length} total interactions
          </Box>
        </Box>
        <TableDownloader
          tableName="drug_interaction_results"
          vars={{ conceptIds: drugMatches?.map((drug: any) => drug.conceptId) }}
        />
      </Box>
      <InteractionTable
        interactionResults={displayedInteractionResults}
        isLoading={isLoading}
      />
    </div>
  );
};
