import React from 'react';
import { Box, Divider, Drawer, Link, List, ListItem, Toolbar } from '@mui/material';
import './TableOfContents.scss';

export enum AboutPageName {
    Introduction = "Introduction",
    Clients = "Clients",
    AboutUs = "AboutUs",
    Stats = "Stats",
    InteractionScore = "InteractionScore"
}

interface TableOfContentsProps {
    pageName: AboutPageName
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ pageName }) => {
    return (
        <>
            <Box className="toc-section">
                <Box className="toc-section-header"><h4>Overview</h4></Box>
                <List>
                    <ListItem><Link href="/about/overview/introduction">Introduction</Link></ListItem>
                    <ListItem><Link href="/about/overview/clients">Clients</Link></ListItem>
                    <ListItem><Link href="/about/overview/about-us">About Us</Link></ListItem>
                    <ListItem><Link href="/about/overview/stats">Stats</Link></ListItem>
                    <ListItem>Data Accessibility</ListItem>
                </List>
            </Box>
            <Box className='toc-section'>
                <Box className="toc-section-header"><h4>Help</h4></Box>
                <List>
                    <ListItem><Link href="/about/overview/data-model">Data Model</Link></ListItem>
                    <ListItem>Grouping</ListItem>
                    <ListItem><Link href="/about/overview/interaction-score">Interaction Score</Link></ListItem>
                    <ListItem>Interaction Directionality</ListItem>
                    <ListItem>Gene Categories</ListItem>
                    <ListItem>Sources</ListItem>
                    <ListItem>Help and Contributing</ListItem>
                </List>
            </Box>
        </>
    )
}