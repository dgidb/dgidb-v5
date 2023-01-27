// hooks/dependencies
import React, { useContext } from 'react';
import { useGetMatchedResults } from 'hooks/queries/useGetAmbiguousResults';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { Box, MenuItem, Select } from '@mui/material';
import AmbiguousResult from './AmbiguousResult';

export const AmbiguousTermsSummary: React.FC = () => {
  const { state } = useContext(GlobalClientContext);
  const data = useGetMatchedResults(state.searchTerms).data;
  const unmatchedTerms = data?.geneMatches?.noMatches
  const ambiguousTerms = data?.geneMatches?.ambiguousMatches

  return (
    <Box>
      <Box>
        { ambiguousTerms?.map((term: any) => {
          return <AmbiguousResult ambiguousTermData={term} />
        })
        }
      </Box>
      <Box><b>Unmatched Terms:</b>
        { unmatchedTerms?.map((term: any) => {
          return <Box>{term.searchTerm}</Box>
        })
        }
      </Box>
    </Box>
  );
};

export default AmbiguousTermsSummary;
