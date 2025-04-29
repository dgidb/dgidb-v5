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
                    <ListItem><Link href="/about/overview/about-us">About Us</Link></ListItem>
                    <ListItem><Link href="/about/overview/druggable-genome">The Druggable Genome</Link></ListItem>
                    <ListItem><Link href="/about/overview/clients">Known Data Clients</Link></ListItem>
                    <ListItem><Link href="/about/overview/stats">Data Statistics</Link></ListItem>
                    <ListItem><Link href="/about/overview/data-accessibility">Data Accessibility</Link></ListItem>
                </List>
            </Box>
            <Box className='toc-section'>
                <Box className="toc-section-header"><h4>Data Structure</h4></Box>
                <List>
                    <ListItem><Link href="/about/overview/data-model">Data Model</Link></ListItem>
                    <ListItem><Link href="/about/overview/grouping">Grouping</Link></ListItem>
                    <ListItem><Link href="/about/overview/interaction-score">Interaction Score</Link></ListItem>
                    <ListItem><Link href="/about/overview/types-and-directionality">Interaction Types</Link></ListItem>
                    <ListItem>Gene Categories</ListItem>
                    <ListItem>Sources</ListItem>
                </List>
            </Box>
            <Box className='toc-section'>
                <Box className="toc-section-header"><h4>Support</h4></Box>
                <List>
                    <ListItem><Link href="/about/overview/contact-us">Contact Us</Link></ListItem>
                    <ListItem><Link href="/about/overview/contributing">Contributing to DGIdb</Link></ListItem>

                </List>
            </Box>
                    
        </>
    )
}