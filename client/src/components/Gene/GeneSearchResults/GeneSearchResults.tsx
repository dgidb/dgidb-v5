import TabPanel from "components/Shared/TabPanel/TabPanel";
import { GeneSummary } from "../GeneSummary";
import AmbiguousTermsSummary from "components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary";
import { Box, Tab, Tabs } from "@mui/material";
import "./GeneSearchResults.scss";
import { GlobalClientContext } from "stores/Global/GlobalClient";
import { useContext } from "react";
import { useGetMatchedResults } from "hooks/queries/useGetAmbiguousResults";

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
    "gene"
  );
  // TODO this seems messy
  const geneMatches = data?.geneMatches?.directMatches;

  const interactionResults =
    isError || isLoading ? (
      <div className="gene-summary-container">
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
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
        <AmbiguousTermsSummary resultType={"gene"} />
      </TabPanel>
    </>
  );
};