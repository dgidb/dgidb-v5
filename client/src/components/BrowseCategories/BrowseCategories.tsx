// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { useGetDruggableSources } from 'hooks/queries/useGetSourceInfo';

// components
import { CategoriesListing } from './CategoriesListing/CategoriesListing';
import {
  Box,
  Grid,
  Typography,
} from '@mui/material';

// styles
import './BrowseCategories.scss';
import { CategoriesCheckboxContainer } from './CategoriesCheckboxContainer/CategoriesCheckboxContainer';

export const BrowseCategories: React.FC = () => {
  const [druggableSources, setDruggableSources] = useState([]);
  const [checkedSources, setCheckedSources] = useState<any>([]);

  const { data, isLoading, isError } = useGetDruggableSources();

  useEffect(() => {
    if (data?.sources?.nodes) {
      const nodes = data?.sources?.nodes;
      const sources: any = [];

      nodes.forEach((node: any) => {
        sources.push(node.sourceDbName);
      });

      setDruggableSources(
        sources.sort((a: string, b: string) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
      );
    }
  }, [data]);

  useEffect(() => {
    if (druggableSources) {
      setCheckedSources(druggableSources);
    }
  }, [druggableSources]);

  return (
    <Box className="browse-cats-container">
      <Grid
        container
        justifyContent="space-between"
        className="browse-cats-title-container"
      >
        <Typography variant="h4" className="browse-cats-title">
          Druggable Gene Categories
        </Typography>
      </Grid>
      <Grid container>
        <Grid>
          <CategoriesCheckboxContainer
            checkOptions={druggableSources}
            checkedSources={checkedSources}
            setCheckedSources={setCheckedSources}
            isLoading={isLoading}
            isError={isError}
          />
        </Grid>
        <Box className="browse-cats-accordion-horizontal-container" flex={1}>
          <CategoriesListing checkedSources={checkedSources} sourcesLoaded={isLoading !== undefined && !isLoading && !isError}/>
        </Box>
      </Grid>
    </Box>
  );
};
