import React from 'react';
import { Link } from '@mui/material';
import { NoteBox } from 'components/About/NoteBox/NoteBox';

import './DruggableGenome.scss';

export const AboutDruggableGenome: React.FC = () => {
    return (
        <>
        <h1>The Druggable Genome</h1>
        <h3>What is druggability?</h3>
        <p>Druggability refers to the potential of a protein to interact with drugs or other chemical compounds based on its structural characteristics. As originally described by Russ Lampel in 2006, a protein is considered druggable if its structure supports interactions with small molecules or other therapeutic agents. Proteins lacking structural features or a favorable location for physical interaction, or those that cannot be modified to facilitate such interactions, are not deemed druggable.
</p>
        <p>The concept of druggability is also influenced by the protein's family, when such information is available. Protein families categorize proteins with similar structural features, signaling mechanisms, and functional attributes. Some protein families, such as tyrosine kinases, are considered particularly druggable due to their shared exploitable signaling pathways or binding pockets. This idea is especially relevant for proteins that can be targeted by small molecules, such as other kinases, ion channels, and transporters.
        </p>
        <p>It is important to note that druggability does not always equate to therapeutic success. While a protein may be classified as druggable based on its structural properties, the therapeutic outcomes of targeting it are not guaranteed. In other words, druggability reflects a protein's potential for interaction with therapeutic compounds, but it does not necessarily imply that such interactions will result in a beneficial clinical effect.
        </p><br/>
        
        <h3>What is the druggable genome?</h3>
        <p>The druggable genome can be defined as the genes or gene products that are known or predicted to interact with drugs, ideally with a therapeutic benefit to the patient. Such genes are of particular interest to large-scale disease profiling efforts  that identify lists of potential pathogenic genes from high-throughput sequence and other genome-wide data.</p><br/>
        
        <h3>The druggable genome in DGIdb</h3>
        <p>DGIdb attempts to organize the druggable genome under two main classes. The first class includes genes with known drug interactions. Such drug-gene interactions are useful for the case where a researcher has a list of candidate genes predicted to be activated in a disease, and wishes to identify drugs that might inhibit or otherwise modulate those genes. These are established interactions between genes and drugs, based largely on literature mining and obtained from existing publicly available reviews and databases. They can come from either gene- or drug-centric database models and are not limited by functional category or drug modality. The second class includes genes that are 'potentially' druggable according to their membership in gene categories associated with druggability (e.g., kinases). Membership in these categories is useful for prioritizing a list of genes according to their potential for drug development. They represent genes that have properties making them suitable for drug targeting but may not currently have a drug targeting them.</p><br/>

        <h3>Limitations</h3>
        <p>Identifying clinically relevant genes using DGIdb has a number of limitations that should be acknowledged. DGIdb provides links between genes and their known or potential drug associations. It does not currently provide any information regarding the druggability of specific mutations, nor does it guarantee that any given drug-gene association represents an appropriate therapeutic intervention. DGIdb's concept of a drug-gene interaction or membership in a potentially druggable category is inclusive and largely driven by the underlying data sources and publications. It includes 43 potentially druggable categories and at least 30 interaction types as defined by source datasets. These include inhibitors, activators, cofactors, ligands, vaccines, and in many cases, interactions of unknown type. Wherever possible we provide filtering by source, interaction type, and gene category to allow the user to quickly disregard possibly spurious candidates.</p>
        <NoteBox>
            <h3>References:</h3>
            <p className="citation">Hopkins AL, Groom CR. <b>The druggable genome</b>. <em>Nat Rev Drug Discov</em>. 2002;1(9):727-730. <Link href="https://doi.org/10.1038/nrd892">doi:10.1038/nrd892</Link></p>
            <p className="citation">Russ AP, Lampel S. <b>The druggable genome: an update</b>. <em>Drug Discov Today</em>. 2005;10(23-24):1607-1610. <Link href="https://doi.org/10.1016/S1359-6446(05)03666-4">doi:10.1016/S1359-6446(05)03666-4</Link></p>

        </NoteBox>
        </>
    );
};