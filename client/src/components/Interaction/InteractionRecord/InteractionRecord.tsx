// hooks / dependencies
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionRecord } from 'hooks/queries/useGetInteractionRecord';

// styles
import './InteractionRecord.scss';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { truncateDecimals } from 'utils/format';
import { Alert } from '@mui/material';
import { NotFoundError } from 'components/Shared/NotFoundError/NotFoundError';
import { useGetIsMobile } from 'hooks/shared/useGetIsMobile';

export const InteractionRecord: React.FC = () => {
  const isMobile = useGetIsMobile();
  const interactionId = useParams().id;
  const { data } = useGetInteractionRecord(interactionId!);
  const interactionData = data?.interaction;

  const interactionExists = interactionData !== null;

  const noData = (
    <TableRow>
      <TableCell style={{ borderBottom: 'none' }}>No data available.</TableCell>
    </TableRow>
  );

  const sectionsMap = [
    {
      name: 'Interaction Info',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="attribute-name">Drug Name:</TableCell>
                <TableCell className="attribute-value">
                  <a
                    className="info-link"
                    href={`/drugs/${interactionData?.drug?.conceptId}`}
                  >
                    {interactionData?.drug?.name} [
                    {interactionData?.drug?.conceptId}]
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute-name">Gene Symbol:</TableCell>
                <TableCell className="attribute-value">
                  <a
                    className="info-link"
                    href={`/genes/${interactionData?.gene?.conceptId}`}
                  >
                    {interactionData?.gene?.name} [
                    {interactionData?.gene?.conceptId}]
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="attribute-name">
                  Interaction Score:
                </TableCell>
                <TableCell className="attribute-value">
                  {truncateDecimals(interactionData?.interactionScore, 2)}
                </TableCell>
              </TableRow>

              {interactionData?.interactionTypes
                ? interactionData?.interactionTypes?.map((attribute: any) => {
                    return (
                      <TableRow
                        key={'Directionality ' + attribute.directionality}
                      >
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
      name: 'Publications',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {interactionData?.publications.length
                ? interactionData?.publications?.map(
                    (pmid: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="attribute-name">
                            {pmid?.citation}{' '}
                            <a
                              className="info-link"
                              href={`https://pubmed.ncbi.nlm.nih.gov/${pmid?.pmid}/`}
                            >
                              (PMID: {pmid?.pmid})
                            </a>
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
      name: 'Sources',
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {interactionData?.sources.length
                ? interactionData?.sources?.map(
                    (source: any, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="attribute-name">
                            {source.fullName}
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
  ];

  return interactionExists ? (
    <Box className="content interaction-record-container">
      <Box className="interaction-record-header">
        <Box className="symbol">
          <a
            className="header-link"
            href={`/drugs/${interactionData?.drug?.conceptId}`}
          >
            {interactionData?.drug?.name}
          </a>{' '}
          <ArrowRightIcon />{' '}
          <a
            className="header-link"
            href={`/genes/${interactionData?.gene?.conceptId}`}
          >
            {interactionData?.gene?.name}
          </a>
        </Box>
      </Box>
      <Box display={isMobile ? 'block' : 'flex'}>
        <Box display="block" width={isMobile ? '100%' : '45%'}>
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
                    maxHeight: '500px',
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
          width={isMobile ? '100%' : '55%'}
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
                <b>Interaction Attributes</b>
              </h3>
            </AccordionSummary>
            <AccordionDetails className="attributes-container">
              <Table>
                <TableBody>
                  {interactionData?.interactionAttributes.length
                    ? interactionData?.interactionAttributes?.map(
                        (attribute: any) => {
                          return (
                            <TableRow
                              key={attribute.name + ' ' + attribute.value}
                            >
                              <TableCell className="attribute-name">
                                {attribute.name}:
                              </TableCell>
                              <TableCell className="attribute-value">
                                {attribute.value}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )
                    : noData}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  ) : (
      <NotFoundError errorMessage='We could not find any results for this interaction.' />
  );
};

export const InteractionRecordContainer: React.FC = () => {
  return (
    <>
      <InteractionRecord />
    </>
  );
};
