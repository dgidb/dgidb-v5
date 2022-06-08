// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';
import { useGetDruggableSources } from 'hooks/queries/useGetDruggableSources';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './BrowseCategories.scss';

export const BrowseCategories: React.FC = () => {

  const { data } = useGetDruggableSources("POTENTIALLY_DRUGGABLE")

  useEffect(() => {
    console.log('druggable data', data)
  }, [data])

  // const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  return (
    <div className="browse-categories-container">
    </div>
  )
};
