// hooks/dependencies
import React, { useState } from 'react';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { GeneIntTable } from 'components/Gene/GeneIntTable';
import './AmbiguousTerms.scss';

interface Props {
  ambiguousTermData: any;
}

export const AmbiguousTermsSummary: React.FC<Props> = ({ambiguousTermData}) => {
  const [selectedTerm, setSelectedTerm] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTerm([event.target.value as string]);
  };
  
  return (
    <Box className="ambiguous-record-container">
      <Box>
        <Box display='flex'><h2><b>Search Term: "{ambiguousTermData.searchTerm}"</b></h2> -- 
          <Select onChange={handleChange} value={selectedTerm[0]} variant="standard" label="Select...">
            {ambiguousTermData?.matches?.map((match: any) => 
            {
              return <MenuItem key={match.name} value={match.name}>{match.name}</MenuItem>
            })}
          </Select>
        </Box>
        <Box className="gene-table-container">
          {selectedTerm?.length > 0 ? <GeneIntTable searchTerms={selectedTerm} />
          : <Box>{ambiguousTermData.searchTerm} is ambiguous. Please select context from drop down.</Box>
          }
        </Box>
      </Box>
    </Box>
  );
};

export default AmbiguousTermsSummary;
