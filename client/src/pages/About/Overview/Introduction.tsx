import { Link, Paper } from '@mui/material';
import React from 'react';

export const Introduction: React.FC = () => {
  return (
    <>          
      <h1>Introduction</h1>
      <p>The <b>Drug-Gene Interaction Database (DGIdb)</b> streamlines the search for druggable therapeutic targets through the aggregation, categorization, and curation of drug and gene data from publications and expert resources. Containing over 10,000 genes and 20,000 drugs involved in over 70,000 drug-gene interactions, DGIdb facilitates research and clinical decision-making and acts as a comprehensive tool for exploring the druggable genome.</p>
      <p>Our goal is to provide a user-friendly search tool and comprehensive database of potentially-druggable genes, with a particular focus on cancer. We hope to capture and prioritize genes that are known to be targeted by existing drugs, especially targeted drugs rather than broad chemotherapeutics. By cross-mapping identifiers and creating a simple interface to these disparate sources we provide a single destination for druggable genome information against which gene lists can be searched and prioritized for downstream research and clinical applications.</p>
      <Paper className="about-note">
        <h4>Preferred Citation</h4>
        <p>If you find DGIdb helpful in your scholarly projects, please cite the following:</p>
        <p>Matthew Cannon, James Stevenson, Kathryn Stahl, Rohit Basu, Adam Coffman, Susanna Kiwala, Joshua F McMichael, Kori Kuzma, Dorian Morrissey, Kelsy Cotto, Elaine R Mardis, Obi L Griffith, Malachi Griffith, Alex H Wagner, <b>DGIdb 5.0: rebuilding the drug–gene interaction database for precision medicine and drug discovery platforms</b>, <em>Nucleic Acids Research</em>, Volume 52, Issue D1, 5 January 2024, Pages D1227–D1235, <Link href="https://doi.org/10.1093/nar/gkad1040" target="_blank" rel="noopener">https://doi.org/10.1093/nar/gkad1040</Link></p>
      </Paper>
    </>
  );
};
