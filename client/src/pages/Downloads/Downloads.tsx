// hooks/dependencies
import React from 'react';

// components
import { Alert, AlertTitle, Box, Typography } from '@mui/material';

// styles
import './Downloads.scss';
import { Info } from './Info/Info';
import { Files } from './Files/Files';

export const Downloads = () => {
  return (
    <div className="downloads-page-container">
      <div className="about-content-container">
        <div className="doc-section">
          <Box className="downloads-title-container">
            <Typography variant="h4" id="downloads">
              Downloads
            </Typography>
          </Box>
          <Alert severity="warning" className="downloads-data-notice">
            <AlertTitle>Data update notice:</AlertTitle>
            An issue affecting the import of a subset of GuideToPharmacology
            records in the 2024-12 data file has been corrected. To ensure
            analyses use the most complete current dataset, please update to the
            latest DGIdb file.
          </Alert>
          <Info />
        </div>
        <div className="doc-section">
          <Box className="downloads-title-container">
            <Typography variant="h4" id="files">
              Files
            </Typography>
          </Box>
          <Files />
        </div>
      </div>
    </div>
  );
};
