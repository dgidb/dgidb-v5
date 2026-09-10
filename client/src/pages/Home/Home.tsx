// hooks/dependencies
import React, { useState, useContext, useEffect } from 'react';

// components
import SearchBar from 'components/Shared/SearchBar/SearchBar';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';
import { SurveyAlert } from 'components/Shared/SurveyAlert/SurveryAlert';
import { NewsFeed } from 'components/Shared/NewsFeed';

// styles
// todo: introduce dark mode back later
// import SunIcon from 'components/Shared/SVG/SunIcon';
// import MoonIcon from 'components/Shared/SVG/MoonIcon';
import './Home.scss';
import { Box, Typography } from '@mui/material';
import { CountsBanner } from 'components/Shared/CountsBanner/CountsBanner';

export const Home: React.FC = () => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    dispatch({ type: ActionTypes.ContentPage });
    navigate({
      pathname: '/results',
      search: `${createSearchParams({
        searchType: state.interactionMode,
        searchTerms: state.searchTerms.join(','),
      })}`,
    });
  };

  const [isToggling, setIsToggling] = useState<boolean>(false);

  useEffect(() => {
    if (isToggling) {
      if (state.themeSettings.darkModeEnabled) {
        dispatch({ type: ActionTypes.DisableDarkMode });
      } else {
        dispatch({ type: ActionTypes.EnableDarkMode });
      }
    }
  }, [isToggling]);

  // allow for toggling again once dark mode setting is updated
  useEffect(() => {
    setIsToggling(false);
  }, [state.themeSettings.darkModeEnabled]);

  useEffect(() => {
    dispatch({ type: ActionTypes.BrandPage });
  }, []);

  return (
    <Box>
      <SurveyAlert />
      <Box className="home-page-container">
        <Box className="home-page-content">
          <CountsBanner />
          <Box className="home-blurb">
            <Typography variant="h6">
              An open-source search engine for{' '}
              <strong>drug-gene interaction</strong> and the{' '}
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
