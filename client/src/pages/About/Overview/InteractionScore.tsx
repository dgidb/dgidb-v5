import React from 'react';
import './InteractionScore.scss';
import { Typography, Box } from '@mui/material';
import { NoteBox } from 'components/About/NoteBox/NoteBox';

export const InteractionScore: React.FC = () => {
    return (
        <>
        <h1>Interaction Score</h1>
        <p>The <i>interaction score</i> is a scoring metric that can be used to rank results in an interaction search result set. The score is calculated for each data version and will remain static for that release</p>
        <p>Interaction score is based on the evidence supporting an interaction. The ratio of average known gene partners for all drugs to the known partners for the given drug and the ratio of average known drug partners for all genes to the known partners for the given gene are calculated for each interaction pair (see figure below). Since the Interaction Score depends on numbers of drug and gene partners, as well as number of supporting publications and sources, this score may change over time. The Interaction Score is displayed in search results and is reported, alongside the score components, as part of the interactions download file.
        </p>

        {/* <Box sx={{textAlign: 'center', marginTop: 4}}>
            <img src="/images/interaction-score.png" alt="Interaction Score in DGIdb" style={{ maxWidth: '100%', height:'auto'}}/>
            <Typography sx={{ textAlign: 'left', marginTop: 1}}>
            <b>Overview of DGIdb’s search scoring system</b>. Schematic of how each of the scores is calculated within DGIdb. The relative drug and gene specificities are calculated for each member of an interaction. The number of publications and sources supporting an interaction is recorded as the evidence score. These three values are then multiplied to generate the interaction score  
            </Typography>
        </Box> */}
        
        <NoteBox>
        <img src="/images/interaction-score.png" alt="Interaction Score in DGIdb" style={{ maxWidth: '100%', height:'auto'}}/>
            <Typography sx={{ textAlign: 'left', marginTop: 1}}>
            <b>Overview of DGIdb’s search scoring system</b>. Schematic of how each of the scores is calculated within DGIdb. The relative drug and gene specificities are calculated for each member of an interaction. The number of publications and sources supporting an interaction is recorded as the evidence score. These three values are then multiplied to generate the interaction score  
            </Typography>
        </NoteBox>


        </>
    );
};