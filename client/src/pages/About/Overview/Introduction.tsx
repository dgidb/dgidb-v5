import { Box, Divider } from '@mui/material';
import React from 'react';
import { NoteBox } from 'components/About/NoteBox/NoteBox';
import { Citation } from './Citation/Citation';
import { pastCitations, preferredCitation } from './Citation/citations';

export const Introduction: React.FC = () => {
  return (
    <>
      <h1>Introduction</h1>
      <p>
        The <b>Drug-Gene Interaction Database (DGIdb)</b> streamlines the search
        for druggable therapeutic targets through the aggregation,
        categorization, and curation of drug and gene data from publications and
        expert resources. Containing over 10,000 genes and 20,000 drugs involved
        in over 70,000 drug-gene interactions, DGIdb facilitates research and
        clinical decision-making and acts as a comprehensive tool for exploring
        the druggable genome.
      </p>
      <p>
        Our goal is to provide a user-friendly search tool and comprehensive
        database of potentially-druggable genes, with a particular focus on
        cancer. We hope to capture and prioritize genes that are known to be
        targeted by existing drugs, especially targeted drugs rather than broad
        chemotherapeutics. By cross-mapping identifiers and creating a simple
        interface to these disparate sources we provide a single destination for
        druggable genome information against which gene lists can be searched
        and prioritized for downstream research and clinical applications.
      </p>
      <NoteBox>
        <h4>Preferred Citation</h4>
        <p>
          If you find DGIdb helpful in your scholarly projects, please cite the
          following:
        </p>
        <Citation {...preferredCitation} />
      </NoteBox>
      <Box mt={5}>
        <NoteBox>
          <h4>Previous Works</h4>
          <p>For previous versions of DGIdb, refer to the citations below.</p>

          {pastCitations.map((citation) => (
            <Box key={citation.doi} mb={2}>
              <Citation {...citation} />
              <Divider sx={{ margin: '15px' }} />
            </Box>
          ))}
        </NoteBox>
      </Box>
    </>
  );
};
