// hooks/dependencies
import React from 'react';
import { Box, CircularProgress, Icon } from '@mui/material';
import AmbiguousResult from './AmbiguousResult';
import './AmbiguousTerms.scss';
import { ResultTypes } from 'types/types';
import { useGetIsMobile } from 'hooks/shared/useGetIsMobile';

interface AmbiguousTermsSummaryProps {
  resultType: ResultTypes;
  isLoading: boolean;
  ambiguousTerms: any;
  unmatchedTerms: any;
}

export const AmbiguousTermsSummary: React.FC<AmbiguousTermsSummaryProps> = ({
  resultType,
  isLoading,
  ambiguousTerms,
  unmatchedTerms,
}) => {
  const isMobile = useGetIsMobile();
  return !isLoading ? (
    <Box
      display="flex"
      justifyContent="space-between"
      minHeight="50px"
      flexWrap={isMobile ? 'wrap' : 'nowrap'}
    >
      <Box width={unmatchedTerms?.length > 0 && !isMobile ? '80%' : '100%'}>
        {ambiguousTerms?.length > 0 ? (
          ambiguousTerms?.map((term: any) => {
            return (
              <AmbiguousResult
                key={term.searchTerm}
                ambiguousTermData={term}
                resultType={resultType}
              />
            );
          })
        ) : (
          <Box className="no-results-message">
            <h3>
              None of your search terms returned <em>ambiguous</em> matches.
            </h3>
          </Box>
        )}
      </Box>
      {unmatchedTerms?.length > 0 && (
        <Box
          width="20%"
          minWidth="fit-content"
          className="unmatched-terms"
          mt={isMobile ? 2 : 0}
        >
          <h3>
            <b>Unmatched Terms:</b>
          </h3>
          <ul className="unmatched-terms-list">
            {unmatchedTerms?.map((term: any) => {
              return (
                <li>
                  <h4>{term.searchTerm}</h4>
                </li>
              );
            })}
          </ul>
        </Box>
      )}
    </Box>
  ) : (
    <Icon
      component={CircularProgress}
      baseClassName="loading-spinner"
      fontSize="small"
    ></Icon>
  );
};

export default AmbiguousTermsSummary;
