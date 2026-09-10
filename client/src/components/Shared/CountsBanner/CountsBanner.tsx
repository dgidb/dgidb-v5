import React from 'react';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getStats, StatsData } from 'utils/stats';

import './CountsBanner.scss';

export const CountsBanner: React.FC = () => {
  const urlDomain = process.env.REACT_APP_DOMAIN;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  useEffect(() => {
    if (!urlDomain) {
      setError('API domain is not configured.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getStats(urlDomain, controller.signal);
        setStats(data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setError('Failed to fetch data.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
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
