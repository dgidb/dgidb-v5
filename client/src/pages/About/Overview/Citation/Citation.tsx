import React from 'react';
import { Link } from '@mui/material';

type CitationProps = {
  authors: string;
  title: string;
  journal: string;
  volumeIssuePages: string;
  doi: string;
};

export const Citation: React.FC<CitationProps> = ({
  authors,
  title,
  journal,
  volumeIssuePages,
  doi,
}) => {
  return (
    <p className="citation">
      {authors}, <b>{title}</b>, <em>{journal}</em>, {volumeIssuePages}{' '}
      <Link href={doi} target="_blank" rel="noopener">
        {doi}
      </Link>
    </p>
  );
};
