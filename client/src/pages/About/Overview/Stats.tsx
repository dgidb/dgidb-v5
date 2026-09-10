import React, { useEffect, useState } from 'react';
import './Stats.scss';
import MedicationIcon from '@mui/icons-material/Medication';
import CachedIcon from '@mui/icons-material/Cached';
import CategoryIcon from '@mui/icons-material/Category';
import SourceIcon from '@mui/icons-material/Source';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StatsCard from 'components/About/StatsCard/StatsCard';
import { ReactComponent as GeneSvg } from 'assets/icons/dna-icon.svg';
import SvgIcon from '@mui/material/SvgIcon';
import { getStats, StatsData } from 'utils/stats';

const GeneIcon = () => <SvgIcon component={GeneSvg} viewBox="0 0 24 24" />;

export const AboutStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const urlDomain = process.env.REACT_APP_DOMAIN;

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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1>Data Statistics</h1>
      <p>Live counts of claims and groups for data in DGIdb:</p>
      <p className="stats-grid">
        <StatsCard
          claimsCount={stats?.drug_claims || 0}
          groupsCount={stats?.drugs || 0}
          icon={<MedicationIcon />}
          title="Drugs"
          variant="entity"
        />
        <StatsCard
          claimsCount={stats?.gene_claims || 0}
          groupsCount={stats?.genes || 0}
          icon={<GeneIcon />}
          title="Genes"
          variant="entity"
        />
        <StatsCard
          claimsCount={stats?.interaction_claims || 0}
          groupsCount={stats?.interactions || 0}
          icon={<CachedIcon />}
          title="Interactions"
          variant="entity"
        />
        <StatsCard
          claimsCount={stats?.gene_categorization_claims || 0}
          groupsCount={stats?.gene_categorizations || 0}
          icon={<CategoryIcon />}
          title="Gene Category"
          variant="entity"
        />
        <StatsCard
          claimsCount={stats?.sources || 0}
          groupsCount={0}
          icon={<SourceIcon />}
          title="Sources"
        />
        <StatsCard
          claimsCount={stats?.publications || 0}
          groupsCount={0}
          icon={<LibraryBooksIcon />}
          title="Publications"
        />
      </p>
    </>
  );
};
