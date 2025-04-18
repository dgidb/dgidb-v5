import { Box } from '@mui/material';
import { AboutPageName, TableOfContents } from 'components/About/TableOfContents/TableOfContents';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import './AboutLayout.scss';

export const AboutLayout: React.FC = () => {
    return (
        <div className={'about-container'}>
            <div className="about-page-container">
                <Box className="about-toc-sidebar">
                    <TableOfContents pageName={AboutPageName.Introduction} />
                </Box>
                <Box className="about-content-container">
                    <Box className="about-content-width-limiter">
                        <Outlet />
                    </Box>
                    <Box className="about-offset-sidebar">
                    </Box>
                </Box>
            </div>
        </div>
    );
};
