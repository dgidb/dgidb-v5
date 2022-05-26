// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './BrowseCategories.scss';

export const BrowseCategories: React.FC = () => {

  const geneSymbol = useParams().gene;

  const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  return (
    <div className="browse-categories-container">

    </div>
  )
};
