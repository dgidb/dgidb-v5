import { Link } from '@mui/material';
import React from 'react';
import { NoteBox } from 'components/About/NoteBox/NoteBox';

export const Contributing: React.FC = () => {
  return (
    <>
      <h1>Contributing to DGIdb</h1>
      <p>
        The DGIdb v5 source code is hosted on GitHub:{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5/"
          target="_blank"
          rel="noopener"
        >
          https://github.com/dgidb/dgidb-v5
        </Link>
        . Active issues in need of development can be found on the issues
        subpage:{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5/issues"
          target="_blank"
          rel="noopener"
        >
          https://github.com/dgidb/dgidb-v5/issues
        </Link>
        .
      </p>

      <p>
        Code changes are made via pull requests to the dev branch with
        major/minor releases being published to the main branch. A general guide
        for making branches, commits, and pull requests can be found within the
        Github First Contributions project:{' '}
        <Link
          href="https://github.com/firstcontributions/first-contributions"
          target="_blank"
          rel="noopener"
        >
          https://github.com/firstcontributions/first-contributions
        </Link>
        . Pull requests should never be made directly to main.
      </p>
    </>
  );
};
