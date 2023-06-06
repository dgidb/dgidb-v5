import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { useGetCategories } from 'hooks/queries/useGetCategories';
import { useContext } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { DirectCategoriesMatch } from '../DirectCategoriesMatch/DirectCategoriesMatch';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
import './GeneCategoriesSearchResults.scss';

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

  // TODO merge search terms resulting in same gene
  const directMatchesDisplay = directMatches && (
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
      {directMatches.map((directMatch: any, i: number) => (
        <Box key={i} boxShadow={2}>
          <DirectCategoriesMatch matchResult={directMatch} />
        </Box>
      ))}
    </>
  );

  // TODO loading screen
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
        {directMatches && directMatchesDisplay}
      </TabPanel>
      <TabPanel value={value} index={1}>
        ambig results here
      </TabPanel>
    </>
  );
};
