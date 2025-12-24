import React, { useEffect, useState } from 'react';
import './Stats.scss';
import MedicationIcon from '@mui/icons-material/Medication';
import CachedIcon from '@mui/icons-material/Cached';
import CategoryIcon from '@mui/icons-material/Category';
import SourceIcon from '@mui/icons-material/Source';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StatsCard from 'components/About/StatsCard/StatsCard';

interface StatsData {
  drug_claims: number;
  drugs: number;
  gene_claims: number;
  genes: number;
  interaction_claims: number;
  interactions: number;
  gene_categorization_claims: number;
  gene_categorizations: number;
  sources: number;
  publications: number;
}

export const AboutStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const urlDomain = process.env.REACT_APP_DOMAIN;

  useEffect(() => {
    // Fetch stats from counts controller endpoint
    const fetchStats = async () => {
      try {
        const response = await fetch(`${urlDomain}/api/counts`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          icon={<MedicationIcon />}
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
