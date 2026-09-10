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
    <div>
      <SurveyAlert />
      <div className="home-page-container">
        <div className="home-page-content">
          <div className="home-blurb">
            An open-source search engine for drug-gene interactions and the
            druggable genome.
          </div>
          <SearchBar handleSubmit={handleSubmit} />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
};
