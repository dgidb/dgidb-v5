// hooks/dependencies
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// styles
import './GeneRecord.scss';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Alert, LinearProgress, Link } from '@mui/material';
import { useGetGeneInteractions } from 'hooks/queries/useGetGeneInteractions';
import InteractionTable from 'components/Shared/InteractionTable/InteractionTable';
import { dropRedundantCites } from 'utils/dropRedundantCites';
import { generateXrefLink } from 'utils/generateXrefLink';
import { ResultTypes } from 'types/types';
import { NotFoundError } from 'components/Shared/NotFoundError/NotFoundError';

export const GeneRecord: React.FC = () => {
  const geneId: any = useParams().gene;

  // get gene attributes
  const { data: fetchedGeneData, isLoading: geneDataIsloading } =
    useGetGeneRecord(geneId);
  const geneData = fetchedGeneData?.gene;

  const geneExists = geneData !== null;

  // get interaction data
  const { data: fetchedInteractionData, isLoading: interactionDataIsLoading } =
    useGetGeneInteractions(geneId);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  useEffect(() => {
    const interactionData: any[] = [];
    const publications: any[] = [];
    fetchedInteractionData?.gene?.interactions?.forEach((int: any) => {
      interactionData.push(int);
      int.publications.forEach((pub: any) => {
        publications.push(pub);
      });
    });
    setInteractionResults(interactionData);
    setPublications(dropRedundantCites(publications));
  }, [fetchedInteractionData]);

  const noData = (
    <TableRow>
      <TableCell style={{ borderBottom: 'none' }}>No data available.</TableCell>
    </TableRow>
  );

  const sectionsMap = [
    {
      name: 'Gene Info',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {geneData?.geneAttributes.length ? (
                geneData?.geneAttributes?.map((attribute: any) => {
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
              ) : geneDataIsloading ? (
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
              {geneData?.geneAliases ? (
                geneData?.geneAliases?.map((alias: any) => {
                  return (
                    <TableRow key={alias.alias}>
                      <TableCell className="attribute-name">
                        {generateXrefLink(
                          alias.alias,
                          ResultTypes.Gene,
                          'meta-link'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : geneDataIsloading ? (
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
      name: 'Categories',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {geneData?.geneCategories ? (
                geneData?.geneCategories?.map((category: any) => {
                  return (
                    <TableRow key={category.name}>
                      <TableCell className="attribute-name">
                        {category.name}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : geneDataIsloading ? (
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
      name: 'Publications',
      sectionContent: (
        <Box className="box-content publication-item">
          <Table>
            <TableBody>
              {publications.length > 0 ? (
                publications.map((pub: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="attribute-name">
                      <Link
                        className="meta-link"
                        href={'https://pubmed.ncbi.nlm.nih.gov/' + pub.pmid}
                        target="_blank"
                      >
                        {pub.citation}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : interactionDataIsLoading ? (
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

  return geneExists ? (
    <Box className="content gene-record-container">
      <Box className="gene-record-header">
        <Box className="symbol">{geneData?.name}</Box>
        <Box className="concept-id">
          {generateXrefLink(geneId, ResultTypes.Gene, 'concept-id-link')}
        </Box>
      </Box>
      <Box display="flex">
        <Box display="block" width="35%">
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
        <Box ml={1} width="65%">
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
                recordType="gene"
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box p={2}>
      <Alert severity="error">
        We could not find any results for this gene.
      </Alert>
      <NotFoundError />
    </Box>
  );
};

export const GeneRecordContainer: React.FC = () => {
  return (
    <>
      <GeneRecord />
    </>
  );
};
