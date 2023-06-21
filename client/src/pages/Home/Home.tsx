// hooks/dependencies
import React, { useState, useContext, useEffect } from 'react';

// components
import SearchBar from 'components/Shared/SearchBar/SearchBar';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';
import { Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

// styles
// todo: introduce dark mode back later
// import SunIcon from 'components/Shared/SVG/SunIcon';
// import MoonIcon from 'components/Shared/SVG/MoonIcon';
import './Home.scss';

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
    <div className="home-page-container">
      <SearchBar handleSubmit={handleSubmit} />
      <div className="home-blurb">
        An open-source search engine for drug-gene interactions and the
        druggable genome.
      </div>
      <Box className="home-links">
        <Grid container width="300px" justifyContent="space-between">
          <Link className="home-link" to="/api">
            API
          </Link>
          <Link className="home-link" to="/downloads">
            Downloads
          </Link>
          <a
            className="home-link"
            href="https://github.com/dgidb/dgidb-v5"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </Grid>
      </Box>
    </div>
  );
};
