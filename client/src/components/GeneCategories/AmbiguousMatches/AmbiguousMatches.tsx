import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { ErrorMessage } from 'components/Shared/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from 'components/Shared/LoadingSpinner/LoadingSpinner';
import { AmbiguousMatchesCard } from '../AmbiguousMatchCard/AmbiguousMatchCard';
import './AmbiguousMatches.scss';

interface Props {
  ambiguousMatches: any[];
  failedMatches: any[];
  isLoading: boolean;
  isError: boolean;
}

export const AmbiguousMatches: React.FC<Props> = ({
  ambiguousMatches,
  failedMatches,
  isLoading,
  isError,
}) => {
  const noAmbiguousMatchesMsg = (
    <Typography>
      None of your search terms returned ambiguous matches.
    </Typography>
  );

  const noAmbiguousOrFailedMatchesMsg = (
    <Typography>
      None of your search terms returned ambiguous or failed matches.
    </Typography>
  );

  const failedMatchesBox = (
    <Paper className="unmatched-terms">
      <Typography variant="h6">Unmatched Terms:</Typography>
      <ul className="unmatched-terms-list">
        {failedMatches?.map((term: any) => {
          return (
            <li>
              <Typography variant="subtitle1">{term.searchTerm}</Typography>
            </li>
          );
        })}
      </ul>
    </Paper>
  );

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <Grid container justifyContent="space-between">
          <Grid item sm={9} xs={12}>
            <Box className="ambig-match-accordions">
              {ambiguousMatches?.length > 0
                ? ambiguousMatches.map((match: any) => (
                    <AmbiguousMatchesCard match={match} />
                  ))
                : failedMatches?.length > 0
                ? noAmbiguousMatchesMsg
                : noAmbiguousOrFailedMatchesMsg}
            </Box>
          </Grid>
          {failedMatches?.length > 0 && (
            <Grid item sm={3}>
              {failedMatchesBox}
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};
