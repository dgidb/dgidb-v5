import React from 'react';
import { Source } from '../../common/interfaces/source.interface';
import SourcesGridItem from './sources-grid-item/sources-grid-item.component'

interface SourcesGridProps {
  sources: Source[]
}

const SourcesGrid: React.FC<{ sources: Source[] }> = ({ sources }: SourcesGridProps) => {
  return (
  <div className="sources-grid">
    {sources.map(source => (
      <div key={source.sourceDbName}>
        <SourcesGridItem source={source}/>
      </div>
    ))}
  </div>)
}

export default SourcesGrid