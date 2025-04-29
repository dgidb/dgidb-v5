import React from 'react';
import { Box, Link, List, ListItem } from '@mui/material';
import './TableOfContents.scss';

import { useLocation } from 'react-router-dom';

export enum AboutPageName {
  Introduction = 'Introduction',
  Clients = 'Clients',
  AboutUs = 'AboutUs',
  Stats = 'Stats',
  InteractionScore = 'InteractionScore',
}

interface TableOfContentsProps {
  pageName: AboutPageName;
}

interface TocLinkProps {
  path: string;
  name: string;
}

const TocItemLink: React.FC<TocLinkProps> = ({ path, name }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <ListItem className={currentPath === path ? 'active' : ''}>
      <Link href={path}>{name}</Link>
    </ListItem>
  );
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  pageName,
}) => {
  return (
    <>
      <Box className="toc-section">
        <Box className="toc-section-header">
          <h4>Overview</h4>
        </Box>
        <List>
          <TocItemLink
            path="/about/overview/introduction"
            name="Introduction"
          />
          <TocItemLink path="/about/overview/about-us" name="About Us" />
          <TocItemLink
            path="/about/overview/druggable-genome"
            name="The Druggable Genome"
          />
          <TocItemLink
            path="/about/overview/clients"
            name="Known Data Clients"
          />
          <TocItemLink path="/about/overview/stats" name="Data Statistics" />
          <TocItemLink
            path="/about/overview/data-accessibility"
            name="Data Accessibility"
          />
        </List>
      </Box>
      <Box className="toc-section">
        <Box className="toc-section-header">
          <h4>Data Structure</h4>
        </Box>
        <List>
          <TocItemLink path="/about/overview/data-model" name="Data Model" />
          <TocItemLink path="/about/overview/grouping" name="Grouping" />
          <TocItemLink
            path="/about/overview/interaction-score"
            name="Interaction Score"
          />
          <TocItemLink
            path="/about/overview/types-and-directionality"
            name="Interaction Types"
          />
        </List>
      </Box>
      <Box className="toc-section">
        <Box className="toc-section-header">
          <h4>Support</h4>
        </Box>
        <List>
          <TocItemLink path="/about/overview/contact-us" name="Contact Us" />
          <TocItemLink
            path="/about/overview/contributing"
            name="Contributing to DGIdb"
          />
        </List>
      </Box>
    </>
  );
};

