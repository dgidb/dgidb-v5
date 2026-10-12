import React from 'react';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getStats, StatsData } from 'utils/stats';

import './CountsBanner.scss';

export const CountsBanner: React.FC = () => {
  const urlDomain = process.env.REACT_APP_DOMAIN;
  const [stats, setStats] = useState<StatsData | null>(null);
  useEffect(() => {
    if (!urlDomain) {
      return;
    }

    const controller = new AbortController();

    const loadStats = async () => {
      const data = await getStats(urlDomain, controller.signal);
      setStats(data);
    };

    void loadStats();

    return () => controller.abort();
  }, [urlDomain]);

  return stats ? (
    <Box className="counts-banner">
      <Typography variant="h5">
        <strong>{stats.drugs}</strong> Drugs
      </Typography>
      <Typography variant="h5">
        <strong>{stats.genes}</strong> Genes
      </Typography>
      <Typography variant="h5">
        <strong>{stats.interactions}</strong> Interactions
      </Typography>
      <Typography variant="h5">
        <strong>{stats.sources}</strong> Sources
      </Typography>
    </Box>
  ) : (
    <></>
  );
};
