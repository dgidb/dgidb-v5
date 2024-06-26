import { Box, Link } from '@mui/material';

export const Info = () => {
  return (
    <div className="about-section-container doc-section">
      <p>
        This page provides access to raw data for DGIdb. While the application
        is open-source, some of the data sources we import may have restrictions
        that prevent us from redistributing them. Please refer to the{' '}
        <Link href="/browse/sources">Browse Sources</Link> page for license
        information for each source.
      </p>
      <p>
        You may instantiate your local database instance by running the
        following command while in the 'server' directory of your local checkout
        of the DGIdb repository:
      </p>
      <Box sx={{ ml: 2 }} className="code-text-container">
        <code className="code-text">rake dgidb:load_local</code>
      </Box>
      <p>
        This will recreate the local database and import the latest data dump
        directly. Please see the{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5/blob/main/README.md"
          target="_blank"
          rel="noopener"
        >
          Installation instructions
        </Link>{' '}
        for more details about setting up a local instance of DGIdb.
      </p>
    </div>
  );
};
