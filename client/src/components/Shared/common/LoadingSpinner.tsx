import { CircularProgress, Grid } from '@mui/material';

export const LoadingSpinner = () => (
  <Grid container justifyContent="center">
    <Grid item>
      <CircularProgress color="secondary" />
    </Grid>
  </Grid>
);
