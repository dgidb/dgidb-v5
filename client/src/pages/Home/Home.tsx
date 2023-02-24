// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import SearchBar from 'components/Shared/SearchBar/SearchBar';
import { useGetInteractionsByGenes, useGetInteractionsByDrugs } from 'hooks/queries/useGetInteractions';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ActionTypes } from 'stores/Global/reducers';

import { queryClient } from 'providers/app';

// styles
import { Button } from 'antd';
// todo: introduce dark mode back later
// import SunIcon from 'components/Shared/SVG/SunIcon';
// import MoonIcon from 'components/Shared/SVG/MoonIcon';
import './Home.scss';

export const Home: React.FC = () => {

  const {state, dispatch} = useContext(GlobalClientContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    dispatch({type: ActionTypes.ContentPage})
    if (state.interactionMode === 'categories') {
      navigate('/categories');
    } else {
      navigate({
        pathname: '/results',
        search: `?${createSearchParams({searchTerms: state.searchTerms.join(',')})}`,
      });
    }
  };

  const { refetch: refetchGenes } = useGetInteractionsByGenes(state.searchTerms);
  const { refetch: refetchDrugs } = useGetInteractionsByDrugs(state.searchTerms);

  const [isToggling, setIsToggling] = useState<boolean>(false);

  // refetch query as terms are added
  useEffect(() => {
    queryClient.clear();
    if(state.searchTerms.length) {
      if (state.interactionMode === 'gene'){
        refetchGenes();
      } else {
        refetchDrugs();
      }
    }
  }, [state.searchTerms])

  useEffect(() => {
    if (isToggling) {
      if(state.themeSettings.darkModeEnabled) {
        dispatch({type: ActionTypes.DisableDarkMode})
      } else {
        dispatch({type: ActionTypes.EnableDarkMode})
      }
    }
  }, [isToggling])

  // allow for toggling again once dark mode setting is updated
  useEffect(() => {
    setIsToggling(false);
  }, [state.themeSettings.darkModeEnabled])

  useEffect(() => {
    dispatch({type: ActionTypes.BrandPage})
  }, [])

  const handleDemoClick = () => {
    switch(state.interactionMode) {
      case 'gene':
        dispatch({type: ActionTypes.AddGeneDemoTerms});
        break;
      case 'drug':
        dispatch({type: ActionTypes.AddDrugDemoTerms});
        break;
      case 'categories':
        dispatch({type: ActionTypes.AddCategoryDemoTerms});
        break;
      default:
        return
    }
  }

  return (
    <div className="home-page-container" >

      {/* <div className="logo">
        DGIdb
      </div>
      <div className="tagline">
        THE DRUG GENE INTERACTION DATABASE
      </div> */}

      <SearchBar handleSubmit={handleSubmit} />

      <div className="home-buttons">
        <Button onClick={() => handleSubmit()} style={{margin: 20, color: 'var(--text-content)', backgroundColor: 'var(--background-light)', border: 'none', width: '120px', height: '35px', fontSize: 16,}}type="primary">Search</Button>
        <Button
          onClick={() => handleDemoClick()}
          style={{margin: 20, color: 'var(--text-content)', backgroundColor: 'var(--background-light)', border: 'none', width: '120px', height: '35px',  fontSize: 16,}}
          type="primary">
            Demo
        </Button>
      </div>
      <div className="home-blurb">
        An open-source search engine for drug-gene interactions and the druggable genome.
      </div>
      <div className="home-links">
        <span style={{padding: '0 15px', fontSize: 18, textDecoration: 'underline'}} >
          API
        </span>
        <span style={{ padding: '0 15px',fontSize: 18, textDecoration: 'underline'}} >
          <a href='/downloads'>Downloads</a>
        </span>
        <span style={{ padding: '0 15px',fontSize: 18, textDecoration: 'underline'}} >
          <a href="https://github.com/dgidb/dgidb-v5">Github</a>
        </span>
      </div>

      {/* todo: introduce at a later date 
      <div className="darkmode-toggle">
        <Switch
          loading={isToggling}
          defaultChecked
          checkedChildren={<SunIcon />}
          unCheckedChildren={<MoonIcon />}
          onChange={() => setIsToggling(true)}
        />
      </div> */}
    </div>
    )
}

