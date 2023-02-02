// hooks/dependencies
import React, { useState } from 'react';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GeneIntTable } from 'components/Gene/GeneIntTable';

interface Props {
  ambiguousTermData: any;
}

export const AmbiguousTermsSummary: React.FC<Props> = ({ambiguousTermData}) => {
  const [selectedTerm, setSelectedTerm] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTerm([event.target.value as string]);
  };
  
  return (
    <Box>
      <Box>
        <Box display='flex'><h3><b>{ambiguousTermData.searchTerm}</b></h3> -- 
          <Select onChange={handleChange} value={selectedTerm[0] || ""}>
            {ambiguousTermData?.matches?.map((match: any) => 
            {
              return <MenuItem key={match.name} value={match.name}>{match.name}</MenuItem>
            })}
          </Select>
        </Box>
        <GeneIntTable searchTerms={selectedTerm} />
      </Box>
    </Box>
  );
};

export default AmbiguousTermsSummary;
