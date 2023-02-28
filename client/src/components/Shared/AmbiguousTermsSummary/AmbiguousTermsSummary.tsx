// hooks/dependencies
import React, { useContext } from 'react';
import { useGetMatchedResults } from 'hooks/queries/useGetAmbiguousResults';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { Box, CircularProgress, Icon } from '@mui/material';
import AmbiguousResult from './AmbiguousResult';
import './AmbiguousTerms.scss';

interface AmbiguousTermsSummaryProps {
  resultType: string;
}

export const AmbiguousTermsSummary: React.FC<AmbiguousTermsSummaryProps> = ({resultType}) => {
  const { state } = useContext(GlobalClientContext);
  const { data, isLoading } = useGetMatchedResults(state.searchTerms, resultType);

  let unmatchedTerms
  let ambiguousTerms

  if (resultType === 'gene') {
    unmatchedTerms = data?.geneMatches?.noMatches
    ambiguousTerms = data?.geneMatches?.ambiguousMatches
  } else {
    unmatchedTerms = data?.drugMatches?.noMatches
    ambiguousTerms = data?.drugMatches?.ambiguousMatches
  }

  return !isLoading ? (
    <Box display='flex' justifyContent='space-between'>
      <Box width={unmatchedTerms?.length > 0 ? '80%' : '100%'}>
        { ambiguousTerms?.length > 0 ? ambiguousTerms?.map((term: any) => {
          return <AmbiguousResult key={term.searchTerm} ambiguousTermData={term} resultType={resultType}/>
        }) :
        <Box className='no-results-message'><h3>None of your search terms returned <em>ambiguous</em> matches.</h3></Box>
        }
      </Box>
      {
        unmatchedTerms?.length > 0 &&
        <Box width='20%' className='unmatched-terms'><h3><b>Unmatched Terms:</b></h3>
          <ul className='unmatched-terms-list'>{ unmatchedTerms?.map((term: any) => {
            return <li><h4>{term.searchTerm}</h4></li>
          })
          }</ul>
        </Box>
      }
    </Box>
  ):
  <Icon component={CircularProgress} baseClassName='loading-spinner' fontSize='small'></Icon>;
};

export default AmbiguousTermsSummary;
