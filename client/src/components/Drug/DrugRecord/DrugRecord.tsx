// hooks/dependencies
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetInteractionsByDrugs } from "hooks/queries/useGetInteractions";
import { useGetDrugRecord } from "hooks/queries/useGetDrugRecord";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";

// styles
import "./DrugRecord.scss";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Table from "@mui/material/Table";

// components
import { Link } from "@mui/material";
import InteractionTable from "components/Shared/InteractionTable/InteractionTable";

export const DrugRecord: React.FC = () => {
  const drug = useParams().drug as string;
  const { data, isLoading } = useGetDrugRecord(drug);
  const drugInteractions = useGetInteractionsByDrugs([drug]).data;
  let drugData = data?.drug;
  const drugInteractionData = drugInteractions?.drugs?.nodes
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  useEffect(() => {
    let interactionData: any = [];
    drugInteractionData?.forEach((drug: any) => {
        drug.interactions.forEach((int: any) => {
          interactionData.push(int)
        })
      })
    setInteractionResults(interactionData)
  }, [drugInteractionData])

  const noData = (
    <TableRow>
      <TableCell style={{ borderBottom: "none" }}>No data available.</TableCell>
    </TableRow>
  );

  const sectionsMap = [
    {
      name: "Drug Info",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugAttributes.length
                ? drugData?.drugAttributes?.map((attribute: any) => {
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
              {drugData?.drugAliases
                ? drugData?.drugAliases?.map((alias: any) => {
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
      name: "Approval Ratings",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugApprovalRatings &&
              drugData.drugApprovalRatings.length > 0
                ? drugData?.drugApprovalRatings?.map(
                    (rating: any, i: number) => {
                      return (
                        <TableRow key={i}>
                          <TableCell className="attribute-name">
                            {rating.source.sourceDbName}
                          </TableCell>
                          <TableCell className="attribute-value">
                            {rating.rating}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                : noData}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      name: "FDA Applications",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugApplications &&
              drugData.drugApplications.length > 0
                ? drugData?.drugApplications?.map((app: any, i: number) => {
                    const appId = app.appNo.match(/\d+/);
                    const url = `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=${appId}`;
                    return (
                      <TableRow key={i}>
                        <TableCell className="attribute-name">
                          {
                            <Link target="_blank" href={url}>
                              {app.appNo} <LaunchIcon sx={{ fontSize: 13 }} />
                            </Link>
                          }
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
    drugData && (
      <Box className="drug-record-container">
        <Box className="drug-record-header">
          <Box className="name">{drug}</Box>
          <Box className="concept-id">{drugData.conceptId}</Box>
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
                <InteractionTable interactionResults={interactionResults} isLoading={isLoading} recordType='drug' />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    )
  );
};
