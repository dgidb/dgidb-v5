// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDrugRecord } from 'hooks/queries/useGetDrugRecord';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';

// styles
import './DrugRecord.scss';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';

// components
import { LinearProgress, Link } from '@mui/material';
import InteractionTable from 'components/Shared/InteractionTable/InteractionTable';
import { useGetDrugInteractions } from 'hooks/queries/useGetDrugInteractions';
import { generateXrefLink } from 'utils/generateXrefLink';
import { ResultTypes } from 'types/types';
import { NotFoundError } from 'components/Shared/NotFoundError/NotFoundError';
import { useGetIsMobile } from 'hooks/shared/useGetIsMobile';

export const DrugRecord: React.FC = () => {
  const isMobile = useGetIsMobile();
  const drugId = useParams().drug as string;

  // get drug attributes
  const { data: fetchedDrugData, isLoading: drugDataIsLoading } =
    useGetDrugRecord(drugId);
  const drugData = fetchedDrugData?.drug;

  const { data: fetchedInteractionData, isLoading: interactionDataIsLoading } =
    useGetDrugInteractions(drugId);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  useEffect(() => {
    let interactionData: any = [];
    fetchedInteractionData?.drug?.interactions?.forEach((int: any) => {
      interactionData.push(int);
    });
    setInteractionResults(interactionData);
  }, [fetchedInteractionData]);

  const drugExists = drugData !== null;

  const noData = (
    <TableRow>
      <TableCell style={{ borderBottom: 'none' }}>No data available.</TableCell>
    </TableRow>
  );

  const sectionsMap = [
    {
      name: 'Drug Info',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugAttributes.length ? (
                drugData?.drugAttributes?.map((attribute: any) => {
                  return (
                    <TableRow key={attribute.name + ' ' + attribute.value}>
                      <TableCell className="attribute-name">
                        {attribute.name}:
                      </TableCell>
                      <TableCell className="attribute-value">
                        {attribute.value}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : drugDataIsLoading ? (
                <LinearProgress
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#480a77',
                    },
                  }}
                  className="linear-bar"
                />
              ) : (
                noData
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      name: 'Aliases',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugAliases ? (
                drugData?.drugAliases?.map((alias: any) => {
                  return (
                    <TableRow key={alias.alias}>
                      <TableCell className="attribute-name">
                        {generateXrefLink(
                          alias.alias,
                          ResultTypes.Drug,
                          'meta-link'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : drugDataIsLoading ? (
                <LinearProgress
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#480a77',
                    },
                  }}
                  className="linear-bar"
                />
              ) : (
                noData
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      name: 'Approval Ratings',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugApprovalRatings &&
              drugData.drugApprovalRatings.length > 0 ? (
                drugData?.drugApprovalRatings?.map((rating: any, i: number) => {
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
                })
              ) : drugDataIsLoading ? (
                <LinearProgress
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#480a77',
                    },
                  }}
                  className="linear-bar"
                />
              ) : (
                noData
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      name: 'FDA Applications',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugApplications &&
              drugData.drugApplications.length > 0 ? (
                drugData?.drugApplications?.map((app: any, i: number) => {
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
              ) : drugDataIsLoading ? (
                <LinearProgress
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#480a77',
                    },
                  }}
                  className="linear-bar"
                />
              ) : (
                noData
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
  ];

  return drugExists ? (
    <Box className="drug-record-container">
      <Box className="drug-record-header">
        <Box className="name">{drugData?.name}</Box>
        <Box className="concept-id">
          {generateXrefLink(drugId, ResultTypes.Drug, 'concept-id-link')}
        </Box>
      </Box>
      <Box display={isMobile ? 'block' : 'flex'}>
        <Box display="block" width={isMobile ? '100%' : '35%'}>
          {sectionsMap.map((section) => {
            return (
              <Accordion key={section.name} defaultExpanded>
                <AccordionSummary
                  style={{
                    padding: '0 10px',
                    backgroundColor: 'var(--background-light)',
                  }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <h3>
                    <b>{section.name}</b>
                  </h3>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    maxHeight: '350px',
                    overflow: 'scroll',
                    padding: '5px',
                  }}
                >
                  {section.sectionContent}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
        <Box
          ml={isMobile ? 0 : 1}
          mt={isMobile ? 2 : 0}
          width={isMobile ? '100%' : '65%'}
        >
          <Accordion defaultExpanded>
            <AccordionSummary
              style={{
                padding: '0 10px',
                backgroundColor: 'var(--background-light)',
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
                isLoading={interactionDataIsLoading}
                recordType="drug"
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  ) : (
    <NotFoundError errorMessage="We could not find any results for this drug." />
  );
};
