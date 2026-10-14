// hooks/dependencies
import React, { useContext } from 'react';

// components
import SearchBar from 'components/Shared/SearchBar/SearchBar';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { SurveyAlert } from 'components/Shared/SurveyAlert/SurveryAlert';
import { NewsFeed } from 'components/Shared/NewsFeed';

// styles
import './Home.scss';
import { Box, Typography } from '@mui/material';
import { CountsBanner } from 'components/Shared/CountsBanner/CountsBanner';

export const Home: React.FC = () => {
  const { state } = useContext(GlobalClientContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    navigate({
      pathname: '/results',
      search: `${createSearchParams({
        searchType: state.interactionMode,
        searchTerms: state.searchTerms.join(','),
      })}`,
    });
  };

  return (
    <Box>
      <SurveyAlert />
      <Box className="home-page-container">
        <Box className="home-page-content">
          <CountsBanner />
          <Box className="home-blurb">
            <Typography variant="h6">
              An open-source search engine for{' '}
              <strong>drug-gene interactions</strong> and the{' '}
              <strong>druggable genome</strong>.
            </Typography>
          </Box>
          <SearchBar handleSubmit={handleSubmit} />
          <NewsFeed />
        </Box>
      </Box>
    </Box>
  );
};
