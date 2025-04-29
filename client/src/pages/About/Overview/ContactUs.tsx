import { Link } from '@mui/material';
import React from 'react';

export const ContactUs: React.FC = () => {
  return (
    <>
      <h1>Contact Us</h1>
      <h3>General Inquiries</h3>
      <p>
        DGIdb is maintained by the Wagner Lab at Nationwide Children’s Hospital
        in Columbus, OH and The Griffith Lab at the Washington University School
        of Medicine in St. Louis, MO. For general inquiries regarding DGIdb,
        please email <Link href="mailto:help@dgidb.org">help@dgidb.org</Link>.
      </p>

      <h3>Troubleshooting</h3>
      <p>
        For assistance with DGIdb please email{' '}
        <Link href="mailto:help@dgidb.org">help@dgidb.org</Link> with a complete
        description of the ongoing issue. Kindly be as detailed as possible to
        ensure a prompt resolution.
      </p>

      <h3>New Sources for the Druggable Genome</h3>
      <p>
        If you have a source of information related to the druggable genome you
        would like us to incorporate, please contact us at help@dgidb.org or
        submit a new feature request on our Github issues page:{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5/issues"
          target="_blank"
          rel="noopener"
        >
          https://github.com/dgidb/dgidb-v5/issues
        </Link>
        .
      </p>

      <h3>API & Software Documentation</h3>
      <p>
        Documentation for setting up a local instance of DGIdb can be found on
        our Github:{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5"
          target="_blank"
          rel="noopener"
        >
          https://github.com/dgidb/dgidb-v5
        </Link>
        . Documentation and examples for writing a GraphQL query to DGIdb can be
        found on our API Playground page:{' '}
        <Link href="https://dgidb.org/api" target="_blank" rel="noopener">
          https://dgidb.org/api
        </Link>
        .
      </p>

      <h3>Bug Reports and Feature Requests</h3>
      <p>
        For bug reports or desired features, please create a corresponding issue
        in the DGIdb v5 Github repo:{' '}
        <Link
          href="https://github.com/dgidb/dgidb-v5/issues"
          target="_blank"
          rel="noopener"
        >
          https://github.com/dgidb/dgidb-v5/issues
        </Link>
        .
      </p>
    </>
  );
};
