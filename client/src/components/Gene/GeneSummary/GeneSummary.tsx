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
import { InteractionTypeGene } from 'components/Gene/GeneCharts';
import { DirectionalityGene } from 'components/Gene/GeneCharts';
import { RegulatoryApprovalGene } from 'components/Gene/GeneCharts';

// styles
import './GeneSummary.scss';
import Box from '@mui/material/Box';
import InteractionTable from 'components/Shared/InteractionTable/InteractionTable';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
import { Tab, Tabs } from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CountProps {
  geneMatches: any[];
  selectedGene: string;
  setSelectedGene: any;
}

const InteractionCount: React.FC<CountProps> = ({
  geneMatches,
  selectedGene,
  setSelectedGene,
}) => {
  const toggleFilter = (geneName: string) => {
    if (selectedGene === geneName) {
      setSelectedGene('');
    } else {
      setSelectedGene(geneName);
    }
  };

  return (
    <div className="interaction-count-container">
      <div className="interaction-count-header">
        <div className="interaction-count-gene">
          <h2>
            <b>Gene</b>
          </h2>
        </div>
        <div className="interaction-count">
          <h2>
            <b>Interactions</b>
          </h2>
        </div>
      </div>
      {geneMatches?.map((gene: any, i: number) => {
        return (
          <div
            className={`interaction-count-row ${
              selectedGene === gene.name ? 'filtered-by' : null
            }`}
            onClick={() => toggleFilter(gene.name)}
            key={i}
          >
            <div className="interaction-count-gene">{gene.name}</div>
            <div className="interaction-count">{gene.interactions?.length}</div>
          </div>
        );
      })}
    </div>
  );
};

interface InfoProps {
  geneMatches: any;
  selectedGene: string;
}

const SummaryInfo: React.FC<InfoProps> = ({ geneMatches, selectedGene }) => {
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

  const filteredGeneMatches =
    selectedGene === ''
      ? geneMatches
      : geneMatches.filter((geneMatch: any) => geneMatch.name === selectedGene);

  return (
    <div className="summary-infographic-container">
      <h2>Infographics</h2>
      {getWindowSize().innerWidth >= 1580 ? (
        <div className="chart-section">
          <InteractionTypeGene data={filteredGeneMatches} />
          <DirectionalityGene data={filteredGeneMatches} />
          <RegulatoryApprovalGene data={filteredGeneMatches} />
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
            <Tab label="Regulatory Approval" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <InteractionTypeGene data={filteredGeneMatches} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DirectionalityGene data={filteredGeneMatches} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <RegulatoryApprovalGene data={filteredGeneMatches} />
          </TabPanel>
        </div>
      )}
    </div>
  );
};

interface SummaryProps {
  genes: any[];
  isLoading: boolean;
}

export const GeneSummary: React.FC<SummaryProps> = ({ genes, isLoading }) => {
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const [selectedGene, setSelectedGene] = useState<string>('');

  useEffect(() => {
    let interactions: any[] = [];
    genes?.forEach((gene: any) => {
      gene?.matches[0].interactions?.forEach((interaction: any) => {
        interactions.push({
          term: gene.searchTerm,
          gene: {
            name: gene.matches[0].name,
            conceptId: gene.matches[0].conceptId,
          },
          ...interaction,
        });
      });
    });
    setInteractionResults(interactions);
  }, [genes]);

  const geneMatches = genes?.map((geneMatch: any) => geneMatch.matches[0]);
  return (
    <div className="gene-summary-container">
      <h1>Gene Summary</h1>
      <div className="gene-summary-content">
        <InteractionCount
          geneMatches={geneMatches}
          selectedGene={selectedGene}
          setSelectedGene={setSelectedGene}
        />
        <SummaryInfo geneMatches={geneMatches} selectedGene={selectedGene} />
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
          tableName="gene_interaction_results"
          vars={{ conceptIds: geneMatches?.map((gene: any) => gene.conceptId) }}
        />
      </Box>
      <InteractionTable
        interactionResults={interactionResults}
        isLoading={isLoading}
      />
    </div>
  );
};
