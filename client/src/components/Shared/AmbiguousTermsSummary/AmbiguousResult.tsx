// hooks/dependencies
import React, { useState, useEffect, useContext } from 'react';
import { Box, MenuItem, Select } from '@mui/material';

interface Props {
  ambiguousTermData: any;
}

export const AmbiguousTermsSummary: React.FC<Props> = ({ambiguousTermData}) => {
  return (
    <Box>
      <Box>
        <Box>{ambiguousTermData.searchTerm} -- 
          <Select>
            {ambiguousTermData?.matches?.map((match: any) => 
            {
              return <MenuItem value={match.name}>{match.name}</MenuItem>
            })}
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default AmbiguousTermsSummary;
