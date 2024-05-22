import React from 'react';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { DrugSummary } from '../DrugSummary';
import AmbiguousTermsSummary from 'components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary';
import { Box, Tab, Tabs } from '@mui/material';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useContext } from 'react';
import { useGetMatchedResults } from 'hooks/queries/useGetAmbiguousResults';
import { ResultTypes } from 'types/types';

interface DrugSearchResultsProps {
  value: number;
  handleChange:
    | ((event: React.SyntheticEvent<Element, Event>, value: any) => void)
    | undefined;
}

export const DrugSearchResults: React.FC<DrugSearchResultsProps> = ({
  value,
  handleChange,
}) => {
  const { state } = useContext(GlobalClientContext);
  const { data, isError, isLoading } = useGetMatchedResults(
    state.searchTerms,
    ResultTypes.Drug,
  );

  const drugMatches = data?.drugMatches?.directMatches;

  const interactionResults =
    isError || isLoading ? (
      <div className="drug-summary-container">
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    ) : !isLoading && drugMatches?.length === 0 ? (
      <Box className="no-results-message">
        <h3>
          None of your search terms returned <em>unique</em> matches.
        </h3>
      </Box>
    ) : (
      <DrugSummary drugs={drugMatches} isLoading={isLoading} />
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
          resultType={ResultTypes.Drug}
          isLoading={isLoading}
          ambiguousTerms={data?.drugMatches?.ambiguousMatches}
          unmatchedTerms={data?.drugMatches?.noMatches}
        />
      </TabPanel>
    </>
  );
};
