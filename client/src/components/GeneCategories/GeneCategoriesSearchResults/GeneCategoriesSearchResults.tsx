import { Tab, Tabs } from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { useGetCategories } from 'hooks/queries/useGetCategories';
import { useContext } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import './GeneCategoriesSearchResults.scss';
import { DirectMatches } from '../DirectMatches/DirectMatches';
import { AmbiguousMatches } from '../AmbiguousMatches/AmbiguousMatches';

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

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Unique Matches" />
        <Tab
          label="Ambiguous or Unmatched"
          disabled={!(!!ambiguousMatches && !!failedMatches)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DirectMatches
          directMatches={combinedMatches}
          isLoading={isLoading}
          isError={isError}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AmbiguousMatches
          ambiguousMatches={ambiguousMatches}
          failedMatches={failedMatches}
          isLoading={isLoading}
          isError={isError}
        />
      </TabPanel>
    </>
  );
};
