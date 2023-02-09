// hooks/dependencies
import React, { useContext } from 'react';
import { useGetMatchedResults } from 'hooks/queries/useGetAmbiguousResults';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { Box } from '@mui/material';
import AmbiguousResult from './AmbiguousResult';
import './AmbiguousTerms.scss';

export const AmbiguousTermsSummary: React.FC = () => {
  const { state } = useContext(GlobalClientContext);
  const data = useGetMatchedResults(state.searchTerms).data;
  const unmatchedTerms = data?.geneMatches?.noMatches
  const ambiguousTerms = data?.geneMatches?.ambiguousMatches

  return (
    <Box display='flex' justifyContent='space-between'>
      <Box width='80%'>
        { ambiguousTerms?.map((term: any) => {
          return <AmbiguousResult ambiguousTermData={term} />
        })
        }
      </Box>
      <Box width='20%' className='unmatched-terms'><h3><b>Unmatched Terms:</b></h3>
        <ul className='unmatched-terms-list'>{ unmatchedTerms?.map((term: any) => {
          return <li><h4>{term.searchTerm}</h4></li>
        })
        }</ul>
      </Box>
    </Box>
  );
};

export default AmbiguousTermsSummary;
