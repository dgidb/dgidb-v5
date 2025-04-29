import { Paper } from '@mui/material';
import React, { ReactNode } from 'react';
import './NoteBox.scss';

interface NoteBoxProps {
  children: ReactNode;
}

export const NoteBox: React.FC<NoteBoxProps> = ({ children }) => (
  <Paper className="about-note-box">{children}</Paper>
);
