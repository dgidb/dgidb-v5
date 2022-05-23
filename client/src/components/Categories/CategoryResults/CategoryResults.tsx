// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetGeneRecord, useGetInteractionsByGenes} from 'hooks/interactions/useGetInteractions';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './CategoryResults.scss';

export const CategoryResults: React.FC = () => {

  const geneSymbol = useParams().gene;

  const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  return (
    <div className="category-results-container">

    </div>
  )
};
