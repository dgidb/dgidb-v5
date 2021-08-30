import React from 'react';
import { Source } from '../../../common/interfaces/source.interface'

const SourcesGridItem: React.FC<{ source: Source}> = ({ source }: {source: Source}) => {
  return (
  <div>
    <p>{source.sourceDbName}</p>
    <p>{source.sourceDbVersion}</p>
  </div>
  )
}

export default SourcesGridItem;