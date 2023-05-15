// hooks/dependencies
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetGeneRecord } from "hooks/queries/useGetGeneRecord";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// styles
import "./GeneRecord.scss";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import InteractionTable from "components/Shared/InteractionTable/InteractionTable";

export const GeneRecord: React.FC = () => {
  const geneId: any = useParams().gene;
  const { data, isLoading } = useGetGeneRecord(geneId);
  const geneData = data?.gene;
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  useEffect(() => {
    let interactionData: any = [];
    geneData?.interactions?.forEach((int: any) => {
      interactionData.push(int);
    });
    setInteractionResults(interactionData);
  }, [geneData]);

  const noData = (
    <TableRow>
      <TableCell style={{ borderBottom: "none" }}>No data available.</TableCell>
    </TableRow>
  );

  const sectionsMap = [
    {
      name: "Gene Info",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {geneData?.geneAttributes.length
                ? geneData?.geneAttributes?.map((attribute: any) => {
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
        </Box>
      ),
    },
    {
      name: "Aliases",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {geneData?.geneAliases
                ? geneData?.geneAliases?.map((alias: any) => {
                    return (
                      <TableRow key={alias.alias}>
                        <TableCell className="attribute-name">
                          {alias.alias}
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
      name: "Categories",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {geneData?.geneCategories
                ? geneData?.geneCategories?.map((category: any) => {
                    return (
                      <TableRow key={category.name}>
                        <TableCell className="attribute-name">
                          {category.name}
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
        <Box className="box-content publication-item">
          <Table>
            <TableBody>
              {geneData?.geneClaims
                ? geneData?.geneClaims
                    ?.filter((claim: any) => claim.source?.citation !== null)
                    .map((claim: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="attribute-name">
                            {claim?.source?.citation}
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
  ];

  return (
    geneData && (
      <Box className="content gene-record-container">
        <Box className="gene-record-header">
          <Box className="symbol">{geneData.name}</Box>
          <Box className="concept-id">{geneData.conceptId}</Box>
        </Box>
        <Box display="flex">
          <Box display="block" width="35%">
            {sectionsMap.map((section) => {
              return (
                <Accordion key={section.name} defaultExpanded>
                  <AccordionSummary
                    style={{
                      padding: "0 10px",
                      backgroundColor: "var(--background-light)",
                    }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <h3>
                      <b>{section.name}</b>
                    </h3>
                  </AccordionSummary>
                  <AccordionDetails
                    style={{
                      maxHeight: "350px",
                      overflow: "scroll",
                      padding: "5px",
                    }}
                  >
                    {section.sectionContent}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
          <Box ml={1} width="65%">
            <Accordion defaultExpanded>
              <AccordionSummary
                style={{
                  padding: "0 10px",
                  backgroundColor: "var(--background-light)",
                }}
                expandIcon={<ExpandMoreIcon />}
              >
                <h3>
                  <b>Interactions</b>
                </h3>
              </AccordionSummary>
              <AccordionDetails>
                <InteractionTable
                  interactionResults={interactionResults}
                  isLoading={isLoading}
                  recordType="gene"
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    )
  );
};

export const GeneRecordContainer: React.FC = () => {
  return (
    <>
      <GeneRecord />
    </>
  );
};
