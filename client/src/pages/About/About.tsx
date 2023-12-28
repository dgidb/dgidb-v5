// dependencies
import React from 'react';

// components
import { Overview } from './SubSections/Overview';
import { Publications } from './SubSections/Publications';
import { TypesAndDirectionalities } from './SubSections/TypesAndDirectionalities';
import { InteractionScore } from './SubSections/InteractionScore';
import { FAQ } from './SubSections/FAQ';
import { KnownDataClients } from './SubSections/KnownDataClients';
import { Contact } from './SubSections/Contact';
import { TypesTable } from 'components/About/InteractionClaimTypes/TypesTable';
import { Box, Button, Link, Menu, MenuItem } from '@mui/material';

// styles
import './About.scss';
import { useGetIsMobile } from 'hooks/shared/useGetIsMobile';

export const About = () => {
  const isMobile = useGetIsMobile();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const aboutSections = [
    {
      name: 'About',
      href: '#about'
    },
    {
      name: 'Publications',
      href: '#publications'
    },
    {
      name: 'Types/Directionalities',
      href: '#interaction-types'
    },
    {
      name: 'Interaction Score',
      href: '#interaction-scores'
    },
    {
      name: 'FAQ',
      href: '#faq'
    },
    {
      name: 'Known Data Clients',
      href: '#known-data-clients'
    },
    {
      name: 'Contact',
      href: '#contact'
    },
    {
      name: 'Current Contributors',
      href: '#current-contributors'
    },
    {
      name: 'Acknowledgements',
      href: '#acknowledgements'
    },
  ]

  const jumpToButton = (
    <>
      <Button id="jump-to-button" variant="contained" onClick={handleClick} style={{position: "fixed", bottom: 10, right: 5}}>
        Jump To
      </Button>
      <Menu
        id="jump-to-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {aboutSections.map((section, index) => {
          return (
            <MenuItem key={index}><Link href={section.href}>{section.name}</Link></MenuItem>
          )
        })}
      </Menu>
    </>
  );

  return (
    <div className="about-page-container">
      {isMobile ? jumpToButton : ""}
      <Box>
        <div className="table-of-contents-container" hidden={isMobile}>
          {aboutSections.map((section, index) => {
            return (
              <Box mb={1} key={index}>
                <Link href={section.href}>{section.name}</Link>
              </Box>
            )
          })}
        </div>
      </Box>
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
          <h3 id="interaction-scores">Interaction Score</h3>
          <InteractionScore />
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
