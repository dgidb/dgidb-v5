// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { useGetInteractionsByGene } from 'hooks/interactions/useGetInteractions';
// components/
import SearchBar from '../../components/SearchBar/SearchBar.component';

// styles
import './results.page.scss';


export const Results: React.FC = () => {

	const { data, error, isLoading, isError, isFetching } = useGetInteractionsByGene('5c60a645-e13e-4236-8aaf-5879bd44993e');

	return (
    <>
      {data.gene.interactions.map((int: any) => {
        let intClaims = int?.interactionClaims.map((intClaim: any) => {
          let name = intClaim?.drugClaim?.drug?.name
          return(
            <div>{name}</div>
          )
        })
        return intClaims;
      })}
    </>
  )
};
