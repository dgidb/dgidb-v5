import React from 'react';
import './Grouping.scss';
import { NoteBox } from 'components/About/NoteBox/NoteBox';
import { Typography, Link } from '@mui/material';

export const Grouping: React.FC = () => {
    return (
        <>
        <h1>Grouping</h1>

        <h4>What is grouping?</h4>
        <p>Grouping is the process by which records that refer to identical underlying concepts despite differing nomenclature are grounded to an ontology and linked under a common identifier.
        </p>
        <p>An example of this is the therapeutic ‘Imatinib’ and its myriad possible nomenclature: Celonib, Enliven, Gleevac, Imalek, Mesylonib, Mitinab, Plivatinib, Shantinib, Temsan, Veenat, or STI-571. These nomenclature all have some tangible link to the underlying active therapeutic concept despite subtle distinctions in other, non-therapeutic contexts.</p>
        <h4>Why do we group records?</h4>
        <p>Grouping drugs and genes in DGIdb allows records to be ontologically grounded and have clear, defined provenance for the underlying concepts involved in an interaction. It allows users to easily find records for a specific concept without requiring knowledge of the name used for it by different sources.</p>

        <h4>How are records grouped?</h4>
        <p>Drug and gene records imported into DGIdb are normalized via external modular normalization services. In brief, graphs are constructed from source data where each source acts as nodes and “has-reference-to” relationships act as edges. Relationships act as explicit, curated references from one record to another. Sets of connected nodes are related as distinct concepts and assigned a common identifier. All associated aliases and attributes are merged under this common identifier.</p>
        <NoteBox>
        <img src="/images/claims-grouping.png" alt="Interaction Score in DGIdb" style={{ maxWidth: '100%', height:'auto'}}/>
            <Typography sx={{ textAlign: 'left', marginTop: 1}}>
            <b>Overview of Claims and Groups in DGIdb</b>. 
            An example of grouping is shown above for six therapeutic claims. Gleevac, Imatinib, and STI-571 (blue) all refer to the same underlying therapeutic and thus are grouped under the label Imatinib. Similarly, Aspirin and Acetylsalicyclic acid (green) refer to the same concept and thus are grouped as well. Conversely, Panacea (yellow) was unable to be linked with any underlying therapeutic and thus did not form a group. 
            </Typography>
        </NoteBox>
        <br />
        <p>Drug records are grouped using <Link href="https://github.com/cancervariants/therapy-normalization" target="_blank" rel="noopener">Thera-Py</Link>.</p>
        <p>Gene records are grouped using the <Link href="https://github.com/cancervariants/gene-normalization" target="_blank" rel="noopener">Gene Normalizer</Link></p>

        </>
    );
};