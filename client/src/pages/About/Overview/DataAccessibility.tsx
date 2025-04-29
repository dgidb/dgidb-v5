import React from 'react';
import './DataAccessibility.scss';
import { Link } from '@mui/material';

export const AboutDataAccesibility: React.FC = () => {
  return (
    <>
      <h1>Data Accessibility</h1>
      <p>
        The central components of FAIR prescribe data producers and publishers
        to ensure their data to be <b>F</b>indable, <b>A</b>ccessible, <b>I</b>
        nteroperable, and <b>R</b>eusable. Our current implementation strategy
        allows DGIdb to embody these values so that the resource remains
        accessible, impactful, and reusable for the broader research community,
        including cancer-focused research efforts. DGIdb strives to provide
        multiple methods of access to ensure that all data is easily
        interoperable and accessible. These efforts include supporting an HTML
        web app with a freely accessible API, as well as two upcoming analysis
        toolkits in Python and R for accessing DGIdb datasets. DGIdb makes use
        of a single GraphQL endpoint to ensure that data is reused and identical
        for every use case while allowing users the flexibility to construct
        arbitrarily complex queries to their data of interest. To ensure
        accessibility, transparency, and reusability of data, all past data
        versions of DGIdb are made freely available as raw data dumps with
        explicit versioning in the Downloads section. Further, all past minor
        and major releases for DGIdb v5 are preserved and freely accessible in
        our{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5"
          target="_blank"
          rel="noopener"
        >
          Github
        </Link>{' '}
        and{' '}
        <Link
          href="https://zenodo.org/records/10027075"
          target="_blank"
          rel="noopener"
        >
          Zenodo
        </Link>{' '}
        repositories.
      </p>

      <h3>Licensing</h3>
      <p>
        The source code for DGIdb is open-source and made available under the
        MIT license. The license is distributed with the source code (
        <Link
          href="https://github.com/dgidb/dgidb-v5/blob/main/LICENSE"
          target="_blank"
          rel="noopener"
        >
          DGIdb license
        </Link>
        ). The data used in DGIdb is all open access and where possible made
        available as raw data dumps in the{' '}
        <Link href="https://dgidb.org/downloads" target="_blank" rel="noopener">
          downloads
        </Link>{' '}
        section.
      </p>
    </>
  );
};
