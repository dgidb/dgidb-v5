import { Chip } from '@mui/material';

import './SourceChip.scss'

interface SourceChipProps {
  source: string;
}
export const SourceChip: React.FC<SourceChipProps> = ({ source }) => (
  <Chip key={source} label={source} className="source-chip" size="small" />
);
