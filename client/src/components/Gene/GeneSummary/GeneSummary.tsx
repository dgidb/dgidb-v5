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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { useGetIsMobile } from 'hooks/shared/useGetIsMobile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import useStorePreviousURL from 'hooks/shared/useStorePreviousUrl';

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
  selectedGenes: string[];
  setSelectedGenes: any;
}

const InteractionCount: React.FC<CountProps> = ({
  geneMatches,
  selectedGenes,
  setSelectedGenes,
}) => {
  const [hideAlert, setHideAlert] = React.useState(
    window.localStorage.getItem('interaction-filter-tip-alert')
  );
  const handleCloseAlertTip = () => {
    setHideAlert('true');
    window.localStorage.setItem('interaction-filter-tip-alert', 'true');
  };
  const toggleFilter = (geneName: string) => {
    if (selectedGenes.includes(geneName)) {
      setSelectedGenes(
        selectedGenes.filter((gene: string) => gene !== geneName)
      );
    } else {
      setSelectedGenes([geneName, ...selectedGenes]);
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
              selectedGenes.includes(gene.name) ? 'filtered-by' : null
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
  selectedGenes: string[];
}

const SummaryInfo: React.FC<InfoProps> = ({ geneMatches, selectedGenes }) => {
  const isMobile = useGetIsMobile();
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
    selectedGenes.length === 0
      ? geneMatches
      : geneMatches.filter((geneMatch: any) =>
          selectedGenes.includes(geneMatch.name)
        );

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
            orientation={isMobile ? 'horizontal' : 'vertical'}
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
  // store the url since there are links on this page that can lead to other pages with breadcrumbs
  useStorePreviousURL();
  const isMobile = useGetIsMobile();
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const [selectedGenes, setSelectedGenes] = useState<string[]>([]);
  const [displayedInteractionResults, setDisplayedInteractionResults] =
    useState<any[]>([]);

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

  useEffect(() => {
    if (selectedGenes.length === 0) {
      setDisplayedInteractionResults(interactionResults);
    } else {
      const newDisplayedInteractionResults: any[] = [];
      interactionResults.forEach((interaction: any) => {
        if (selectedGenes.includes(interaction.gene.name))
          newDisplayedInteractionResults.push(interaction);
      });
      setDisplayedInteractionResults(newDisplayedInteractionResults);
    }
  }, [selectedGenes, interactionResults]);

  const geneMatches = genes?.map((geneMatch: any) => geneMatch.matches[0]);

  return (
    <div className="gene-summary-container">
      <h1>Gene Summary</h1>
      <div className="gene-summary-content">
        <InteractionCount
          geneMatches={geneMatches}
          selectedGenes={selectedGenes}
          setSelectedGenes={setSelectedGenes}
        />
        <SummaryInfo geneMatches={geneMatches} selectedGenes={selectedGenes} />
      </div>
      <Box
        display="flex"
        mt={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" flexWrap="wrap" mb={1}>
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
        interactionResults={displayedInteractionResults}
        isLoading={isLoading}
      />
    </div>
  );
};
