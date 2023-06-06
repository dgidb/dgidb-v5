import {
  Box,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { useGetCategories } from 'hooks/queries/useGetCategories';
import { useContext } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { DirectMatchCard } from '../DirectMatchCard/DirectMatchCard';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
import './GeneCategoriesSearchResults.scss';
import { ErrorMessage } from 'components/Shared/ErrorMessage/ErrorMessage';

interface GeneCategoriesSearchResultsProps {
  value: number;
  handleChange:
    | ((event: React.SyntheticEvent<Element, Event>, value: any) => void)
    | undefined;
}

export const GeneCategoriesSearchResults: React.FC<
  GeneCategoriesSearchResultsProps
> = ({ value, handleChange }) => {
  const { state } = useContext(GlobalClientContext);
  const { data, isError, isLoading } = useGetCategories(state.searchTerms);
  const directMatches = data?.geneMatches?.directMatches;
  const ambiguousMatches = data?.geneMatches?.ambiguousMatches;
  const failedMatches = data?.geneMatches?.noMatches;

  console.log(data);

  const combinedMatches = directMatches?.reduce((acc: any[], curr: any) => {
    const existing = acc.find(
      (termMatch) =>
        termMatch.matches[0].conceptId === curr.matches[0].conceptId
    );
    if (existing) {
      existing.matchingTerms.push(curr.searchTerm);
    } else {
      acc.push({ matchingTerms: [curr.searchTerm], ...curr });
    }
    return acc;
  }, []);

  const loadingSpin = (
    <Grid container justifyContent="center">
      <Grid item>
        <CircularProgress color="secondary" />
      </Grid>
    </Grid>
  );

  const noDirectMatchesMsg = (
    <Typography>No unique matches were found for the provided search terms.</Typography>
  )

  const directMatchesDisplay = (
    <>
      <Grid
        container
        justifyContent="space-between"
        className="title-container"
      >
        <Typography variant="h4">Categories Search Results</Typography>
        <TableDownloader
          tableName="gene_category_results"
          vars={{ names: state.searchTerms }}
        />
      </Grid>
      {isLoading
        ? loadingSpin
        : isError
        ? <ErrorMessage />
        : combinedMatches?.length === 0 ?
        noDirectMatchesMsg
        : combinedMatches?.map((directMatch: any, i: number) => (
            <Box key={i} boxShadow={2}>
              <DirectMatchCard matchResult={{ ...directMatch }} />
            </Box>
          ))}
    </>
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
        <Tab label="Ambiguous or Unmatched"  disabled={!!ambiguousMatches && !!failedMatches}/>
      </Tabs>
      <TabPanel value={value} index={0}>
        {directMatchesDisplay}
      </TabPanel>
      <TabPanel value={value} index={1}>
        TODO ambig results here
      </TabPanel>
    </>
  );
};
