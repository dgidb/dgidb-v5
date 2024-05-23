import React from 'react';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { GeneSummary } from '../GeneSummary';
import AmbiguousTermsSummary from 'components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary';
import { Box, CircularProgress, Icon, Tab, Tabs } from '@mui/material';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useContext } from 'react';
import { useGetMatchedResults } from 'hooks/queries/useGetAmbiguousResults';
import { ResultTypes } from 'types/types';

interface GeneSearchResultsProps {
  value: number;
  handleChange:
    | ((event: React.SyntheticEvent<Element, Event>, value: any) => void)
    | undefined;
}

export const GeneSearchResults: React.FC<GeneSearchResultsProps> = ({
  value,
  handleChange,
}) => {
  const { state } = useContext(GlobalClientContext);
  const { data, isError, isLoading } = useGetMatchedResults(
    state.searchTerms,
    ResultTypes.Gene
  );
  const geneMatches = data?.geneMatches?.directMatches;

  const interactionResults =
    isError || isLoading ? (
      <div className="gene-summary-container">
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && (
          <Icon
            component={CircularProgress}
            baseClassName="loading-spinner"
            fontSize="small"
          />
        )}
      </div>
    ) : !isLoading && geneMatches?.length === 0 ? (
      <Box className="no-results-message">
        <h3>
          None of your search terms returned <em>unique</em> matches.
        </h3>
      </Box>
    ) : (
      <GeneSummary genes={geneMatches} isLoading={isLoading} />
    );

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Unique Matches" />
        <Tab label="Ambiguous or Unmatched" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {interactionResults}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AmbiguousTermsSummary
          resultType={ResultTypes.Gene}
          isLoading={isLoading}
          ambiguousTerms={data?.geneMatches?.ambiguousMatches}
          unmatchedTerms={data?.geneMatches?.noMatches}
        />
      </TabPanel>
    </>
  );
};
