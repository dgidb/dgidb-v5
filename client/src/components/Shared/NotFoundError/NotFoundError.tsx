import React from 'react';
import { Box } from '@mui/material';
import './NotFoundError.scss';

export const NotFoundError: React.FC = () => {
  return (
    <Box display="flex">
      <img
        src="/images/dgidb-404-logo.png"
        alt="404 error"
        className="not-found-404"
      />
    </Box>
  );
};
