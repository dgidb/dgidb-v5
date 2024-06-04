import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ErrorMessage } from 'components/Shared/ErrorMessage/ErrorMessage';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
import { useContext } from 'react';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { DirectMatchCard } from '../DirectMatchCard/DirectMatchCard';
import { LoadingSpinner } from 'components/Shared/LoadingSpinner/LoadingSpinner';

interface Props {
  directMatches: any[];
  isLoading: boolean;
  isError: boolean;
}

export const DirectMatches: React.FC<Props> = ({
  directMatches,
  isLoading,
  isError,
}) => {
  const { state } = useContext(GlobalClientContext);

  const noDirectMatchesMsg = (
    <Typography>
      No unique matches were found for the provided search terms.
    </Typography>
  );

  return (
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
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage />
      ) : directMatches?.length === 0 ? (
        noDirectMatchesMsg
      ) : (
        directMatches?.map((directMatch: any, i: number) => (
          <Box key={i} boxShadow={2}>
            <DirectMatchCard matchResult={{ ...directMatch }} />
          </Box>
        ))
      )}
    </>
  );
};
