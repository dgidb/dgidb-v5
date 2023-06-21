// hooks/dependencies
import React from 'react';

// components
import { Box, Typography } from '@mui/material';

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
