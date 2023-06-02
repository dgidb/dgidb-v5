// hooks/dependencies
import React, { useState, useContext, useEffect } from 'react';

// components
import { Overview } from './SubSections/Overview';
import { Publications } from './SubSections/Publications';
import { TypesAndDirectionalities } from './SubSections/TypesAndDirectionalities';
import { InteractionScoreQueryScore } from './SubSections/InteractionScoreQueryScore';
import { FAQ } from './SubSections/FAQ';
import { KnownDataClients } from './SubSections/KnownDataClients';
import { Contact } from './SubSections/Contact';
import { TypesTable } from 'components/About/InteractionClaimTypes/TypesTable';
// styles
import './About.scss';
import { Box, Link } from '@mui/material';

export const About = () => {
  return (
    <div className="about-page-container">
      <div className="table-of-contents-container">
        <Box mb={1} mt={1}>
          <Link href="#about">About</Link>
        </Box>
        <Box mb={1}>
          <Link href="#publications">Publications</Link>
        </Box>
        <Box mb={1}>
          <Link href="#interaction-types">Types/Directionalities</Link>
        </Box>
        <Box mb={1}>
          <Link href="#interaction-scores">Score/Query Score</Link>
        </Box>
        <Box mb={1}>
          <Link href="#faq">FAQ</Link>
        </Box>
        <Box mb={1}>
          <Link href="#known-data-clients">Known Data Clients</Link>
        </Box>
        <Box mb={1}>
          <Link href="#contact">Contact</Link>
        </Box>
        <Box mb={1}>
          <Link href="#current-contributors">Current Contributors</Link>
        </Box>
        <Box mb={1}>
          <Link href="#acknowledgements">Acknowledgements</Link>
        </Box>
      </div>
      <div className="about-content-container">
        <div className="doc-section">
          <h3 id="about">About</h3>
          <Overview />
        </div>
        <div className="doc-section">
          <h3 id="publications">Publications</h3>
          <Publications />
        </div>
        <div className="doc-section">
          <h3 id="interaction-types">Interaction Types and Directionalities</h3>
          <TypesAndDirectionalities />
          <TypesTable />
        </div>
        <div className="doc-section">
          <h3 id="interaction-scores">Interaction Score and Query Score</h3>
          <InteractionScoreQueryScore />
        </div>
        <div className="doc-section">
          <h3 id="faq">FAQ</h3>
          <FAQ />
        </div>
        <div className="doc-section">
          <h3 id="known-data-clients">Known Data Clients</h3>
          <KnownDataClients />
        </div>
        <div className="doc-section">
          <h3 id="contact">Contact</h3>
          <Contact />
        </div>
      </div>
    </div>
  );
};
