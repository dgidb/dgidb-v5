import { Paper } from '@mui/material';
import React from 'react';
import './StatsCard.scss';

interface StatsCardProps {
  claimsCount: number;
  groupsCount: number;
  icon: any;
  title: string;
  variant?: 'entity' | 'evidence';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  claimsCount,
  groupsCount,
  icon,
  title,
  variant,
}) => {
  return (
    <Paper className="stats-card">
      <span className="stats-header">
        {icon}
        <h4>{title}</h4>
      </span>
      {variant === 'entity' ? (
        <span className='stats-subtext'>
          <b className='bold-count'>{claimsCount}</b> Claims across <b className='bold-count'>{groupsCount}</b> Groups
        </span>
      ) : (
        <span className='stats-subtext'>
          <b className='bold-count'>{claimsCount}</b> {title.toLowerCase()}
        </span>
      )}
    </Paper>
  );
};

export default StatsCard;
