import React from 'react';
import SourcesGrid from '../../components/sources-grid/sources-grid.component' 
import { useGetSources } from '../../hooks/sources/useGetSources';

const Home: React.FC = () => {
  const sources = useGetSources();

  return (
    <div className="home">
      <SourcesGrid sources={sources || []}/>
    </div>
  )
}

export default Home