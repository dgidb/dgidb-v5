// hooks / dependencies
import React from "react";
import { useParams } from "react-router-dom";
import { useGetInteractionRecord } from "hooks/queries/useGetInteractionRecord";

// styles
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { selectionSetMatchesResult } from "@apollo/client/cache/inmemory/helpers";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ArrowRight } from "@mui/icons-material";



export const InteractionRecord: React.FC = () => {
    const interactionId = useParams().id;
    const { data } = useGetInteractionRecord(interactionId!);
    const noData = (
        <TableRow>
          <TableCell style={{ borderBottom: "none" }}>No data available.</TableCell>
        </TableRow>
      );

    const sectionsMap = [
      {
        name: "Interaction Info",
        sectionContent: (
          <Box className="box-content">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="attribute-name">
                    Drug Name:
                  </TableCell>
                  <TableCell className="attribute-value">
                    {data?.interaction?.drug?.name} ({data?.interaction?.drug?.conceptId})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="attribute-name">
                    Gene Symbol:
                  </TableCell>
                  <TableCell className="attribute-value">
                    {data?.interaction?.gene?.name} ({data?.interaction?.gene?.conceptId})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="attribute-name">
                    Interaction Score:
                  </TableCell>
                  <TableCell className="attribute-value">
                    {data?.interaction?.interactionScore}
                  </TableCell>
                </TableRow>

                {data?.interaction?.interactionTypes
                ? data?.interaction?.interactionTypes?.map((attribute: any) => {
                    return (

                      <TableRow key={"Directionality " + attribute.directionality}>
                        <TableCell className="attribute-name">
                          Type & Directionality:
                        </TableCell>
                        <TableCell className="attribute-value">
                          {attribute.type} ({attribute.directionality})
                        </TableCell>
                      </TableRow>
                    );
                  })
                : noData}
              </TableBody>
            </Table>
          </Box>
        ),
      },
      {
        name: "Publications",
        sectionContent: (
          <Box className="box-content">
            <Table>
              <TableBody>
                {data?.interaction?.publications.length
                ? data?.interaction?.publications?.map((pmid: any, index: number) => {
                  return(
                    <TableRow key={index}>
                      <TableCell className="attribute-name">
                        {pmid?.citation} (PMID: {pmid?.pmid})
                      </TableCell>
                    </TableRow>
                  );
                })
              : noData}
              </TableBody>
            </Table>
          </Box>
        ),
      },
    ]

    return data && (
      <Box className="content interaction-record-container">
        <Box className="interaction-record-header">
          <Box className="symbol">{data?.interaction?.drug?.name} <ArrowRightIcon/> {data?.interaction?.gene?.name}</Box>
        </Box>
        <Box display="flex">
          <Box display="block" width="45%">
            {sectionsMap.map((section) => {
            return (
              <Accordion key={section.name} defaultExpanded>
                <AccordionSummary style={{padding: "0 10px", backgroundColor: "var(--background-light)",}} expandIcon={<ExpandMoreIcon />}>
                  <h3><b>{section.name}</b></h3>
                </AccordionSummary>
                <AccordionDetails style={{maxHeight: "350px", overflow: "scroll", padding: "5px",}}>
                  {section.sectionContent}
                </AccordionDetails>
              </Accordion>
            );
            })}
          </Box>
          <Box ml={1} width="55%">
            <Accordion defaultExpanded>
              <AccordionSummary style={{padding: "0 10px", backgroundColor: "var(--background-light)",}} expandIcon={<ExpandMoreIcon/>}>
                <h3><b>Interaction Attributes</b></h3>
              </AccordionSummary>
              <AccordionDetails>
                <Table>
                  <TableBody>
                    {data?.interaction?.interactionAttributes.length
                    ? data?.interaction?.interactionAttributes?.map((attribute: any) => {
                      return (
                        <TableRow key={attribute.name + " " + attribute.value}>
                          <TableCell className="attribute-name">
                            {attribute.name}:
                          </TableCell>
                          <TableCell className="attribute-value">
                            {attribute.value}
                          </TableCell>
                        </TableRow>
                      );
                    })
                    : noData}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    );
};

export const InteractionRecordContainer: React.FC = () => {
    return (
      <>
        <InteractionRecord />
      </>
    );
  };
