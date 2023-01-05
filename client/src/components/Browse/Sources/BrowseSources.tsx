import React, { useState, useContext, useEffect } from 'react';

// hooks/dependencies
import {
  useGetDruggableSources,
  useGetGeneSources,
  useGetDrugSources,
  useGetInteractionSources,
} from 'hooks/queries/useGetDruggableSources';

// styles
import './BrowseSources.scss';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const BrowseSources = () => {
  const [filter, setFilter] = useState<string>("All");

  const {data: geneData } = useGetGeneSources("GENE");
  const {data: drugData } = useGetDrugSources("DRUG");
  const {data: interactionData } = useGetInteractionSources("INTERACTION");
  const {data: potentiallyDruggableData } = useGetDruggableSources("POTENTIALLY_DRUGGABLE");

  let geneSources = geneData?.sources?.nodes;
  let drugSources = drugData?.sources?.nodes;
  let interactionSources = interactionData?.sources?.nodes;
  let potentiallyDruggableSources = potentiallyDruggableData?.sources?.nodes;

  const sectionsMap = [
    {
      heading: "Gene Sources",
      sources: geneSources,
      value: "Gene",
    },
    {
      heading: "Drug Sources",
      sources: drugSources,
      value: "Drug",
    },
    {
      heading: "Interaction Sources",
      sources: interactionSources,
      value: "Interaction",
    },
    {
      heading: "Potentially Druggable Sources",
      sources: potentiallyDruggableSources,
      value: "Potentially Druggable",
    },
  ]

  const handleButtonClick = (event: any) => {
    const value = event.target.value
    setFilter(value)
  }

  const getCard = (src: any) => {
    const geneClaimsCountExists = src.geneClaimsCount ? true : false
    const geneClaimsInGroupExists = src.geneClaimsInGroupsCount ? true : false

    const drugClaimsCountExists = src.drugClaimsCount ? true : false
    const drugClaimsInGroupExists = src.drugClaimsInGroupsCount ? true : false

    const interactionClaimsCountExists = src.interactionClaimsCount ? true : false
    const interactionClaimsInGroupExists = src.interactionClaimsInGroupsCount ? true : false
    
    return (
      <Box className="source-item-card">
        <Box className="source-item-name">{src.sourceDbName}</Box>
        <Box className="source-item-rows">
          <Box className="source-section" hidden={!(geneClaimsCountExists && geneClaimsInGroupExists)}>
            <Box><b>Gene Claims Count:</b> {src.geneClaimsCount}</Box>
            <Box><b>Gene Claims In Group:</b> {src.geneClaimsInGroupsCount}</Box>
          </Box>
          <Box className="source-section" hidden={!(drugClaimsCountExists && drugClaimsInGroupExists)}>
            <Box><b>Drug Claims Count:</b> {src.drugClaimsCount}</Box>
            <Box><b>Drug Claims In Group:</b> {src.drugClaimsInGroupsCount}</Box>
          </Box>
          <Box className="source-section" hidden={!(interactionClaimsCountExists && interactionClaimsInGroupExists)}>
            <Box><b>Interaction Claims Count:</b> {src.interactionClaimsCount}</Box>
            <Box><b>Interaction Claims In Group:</b> {src.interactionClaimsInGroupsCount}</Box>
          </Box>
          <Box className="source-section"><b>License: </b><a href={src.licenseLink} target="_blank">{src.license}</a></Box>
          <Box m="10px">
            <Accordion>
              <AccordionSummary
                style={{padding: "0 10px"}}
                expandIcon={<ExpandMoreIcon />}
              >
                <b>Full Citation</b>
              </AccordionSummary>
              <AccordionDetails style={{maxHeight: "150px", overflow: "scroll", padding: "0 10px 10px"}}>
                {src.citation}
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    )
  }

  // gene section, drug section, interaction, potentially druggable

  return (
    <Box className="sources-page-container">
      <Box display="flex"><h1 style={{marginRight: "10px"}}><b>Sources</b></h1> <Box my="auto">details about data sources in DGIdb</Box></Box>
      <Box mb="20px">
        <ButtonGroup color="primary" onClick={handleButtonClick} className="filter-buttons">
          <Button variant={filter === "All" ? "outlined" : "contained"} 
            value="All">
              All
            </Button>
          <Button
            variant={filter === "Gene" ? "outlined" : "contained"} 
            value="Gene">
            Gene
          </Button>
          <Button
            variant={filter === "Drug" ? "outlined" : "contained"} 
            value="Drug">
            Drug
          </Button>
          <Button
            variant={filter === "Interaction" ? "outlined" : "contained"} 
            value="Interaction">
            Interaction
          </Button>
          <Button
            variant={filter === "Potentially Druggable" ? "outlined" : "contained"} 
            value="Potentially Druggable">
            Potentially Druggable
          </Button>
        </ButtonGroup>
      </Box>
      {
        sectionsMap.map((section: any) => {
          return section.value === filter || filter === "All" ? (
            <>
              <Box className="source-type-header"><h2><b>{section.heading}</b></h2></Box>
              <Box className="sources-grid">
                {
                  section.sources?.map((src: any) => {
                    return getCard(src)
                  })
                }
              </Box>
            </>
          ) : <></>
        }) 
      }
    </Box>
  )
}