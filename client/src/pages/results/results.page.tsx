// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { useGetInteractionsByGene } from '../../api/hooks/interactions/useGetInteractions';

// components/
import SearchBar from '../../components/searchbar/SearchBar.component';

// styles
import './results.page.scss';


export const Results: React.FC = () => {

	const { data, error, isLoading, isError, isFetching } = useGetInteractionsByGene('5c60a645-e13e-4236-8aaf-5879bd44993e');

	return (
    <>

    </>
  )
};
