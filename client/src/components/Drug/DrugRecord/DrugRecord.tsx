// hooks/dependencies
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByDrugs} from 'hooks/queries/useGetInteractions';
import { useGetDrugRecord } from 'hooks/queries/useGetDrugRecord';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './DrugRecord.scss';
import { Table as AntTable } from 'antd';
import { ColumnsType } from 'antd/es/table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';

// components
import { PublicationsTooltip } from 'components/Shared/Tooltip/Tooltip'
import { SourcesTooltip } from 'components/Shared/Tooltip/Tooltip'

const DrugRecordTable: React.FC = () => {
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const drugName = useParams().drug

  const { data } = useGetInteractionsByDrugs([drugName!]);

  let drugs = data?.drugs?.nodes?.[0]?.interactions;

  useEffect(() => {
    setInteractionResults(drugs)
  }, [drugs])

  const columns: ColumnsType<any> = [
    {
      title: 'Gene',
      dataIndex: ['drug', 'name'],
      render: (text: any, record: any) => (
        <a href={`/genes/${record?.gene?.name}`}>{record?.gene?.name}</a>
      )
    },
    {
      title: 'Type',
      dataIndex: ['interactionTypes'],
      render: (text: any, record: any) => {
        return record?.interactionTypes.map((int: any) => {
          return <span>{int?.type}</span>
        })
      }
    },
    // {
    //   title: 'Interaction Info',
    //   dataIndex: ['publications'],
    //   render: (text: any, record: any) => (
    //     <span>{record?.publications?.length}</span>
    //   )
    // },
    {
      title: "PMIDs",
      dataIndex: ["publications"],
      render: (text: any, record: any) => (
        <span> <PublicationsTooltip displayText={record?.publications.length} hoverTexts={record?.publications}></PublicationsTooltip></span>
      ),
    },
    {
      title: "Sources",
      dataIndex: ["sources"],
      render: (text: any, record: any) => <span> <SourcesTooltip hoverTexts={record?.sources} displayText={record?.sources.length}></SourcesTooltip></span>,
    },
    {
      title: 'Interaction Score',
      dataIndex: ['interactionScore'],
      render: (text: any, record: any) => (
        <span>{truncateDecimals(record?.interactionScore, 2)}</span>
      )
    },
  ]

  return (
    <Box className="gene-record-interactions">
      <AntTable
        dataSource={interactionResults}
        columns={columns}
        pagination={{ pageSize: 10}}
      />
    </Box>
  )
};

export const DrugRecord: React.FC = () => {
  const drug = useParams().drug as string;
  const { data, isLoading } = useGetDrugRecord(drug);
  let drugData = data?.drug;

  const noData = (
    <TableRow>
      <TableCell style={{borderBottom: "none"}}>No data available.</TableCell>
    </TableRow>
  )

  const sectionsMap = [
    {
      name: "Drug Info",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.drugAttributes.length ? drugData?.drugAttributes?.map((attribute: any) => {
                return (
                  <TableRow key={attribute.name + " " + attribute.value}>
                    <TableCell className="attribute-name">{attribute.name}:</TableCell>
                    <TableCell className="attribute-value">{attribute.value}</TableCell>
                  </TableRow>
                )
              }) : noData}
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
              {drugData?.drugAliases ? drugData?.drugAliases?.map((alias: any) => {
                return (
                  <TableRow key={alias.alias}>
                    <TableCell className="attribute-name">{alias.alias}</TableCell>
                  </TableRow>
                )
              }) : noData}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      // TODO: THIS NEEDS IMPLEMENTED
      name: "Active",
      sectionContent: (
        <Box className="box-content">
          <Table>
            <TableBody>
              {drugData?.geneCategories ? drugData?.geneCategories?.map((category: any) => {
                return (
                  <TableRow key={category.name}>
                    <TableCell className="attribute-name">{category.name}:</TableCell>
                  </TableRow>
                )
                }) : noData}
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
              {drugData?.geneCategories ? drugData?.geneCategories?.map((category: any) => {
                return (
                  <TableRow key={category.name}>
                    <TableCell className="attribute-name">{category.name}:</TableCell>
                  </TableRow>
                )
              }) : noData}
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
              {drugData?.geneClaims ? drugData?.geneClaims?.map((claim: any) => {
                return (
                  <TableRow key={claim?.source?.citation}>
                    <TableCell className="attribute-name">{claim?.source?.citation}:</TableCell>
                  </TableRow>
                )
              }) : noData}
            </TableBody>
          </Table>
        </Box>
      ),
    },
  ]

  return drugData && (
    <Box className="drug-record-container">
      <Box className="drug-record-header">
        <Box className="name">{drug}</Box>
        <Box className="concept-id">{drugData.conceptId}</Box>
      </Box>
      <Box display="flex">
        <Box display="block" width="35%">
          {
          sectionsMap.map((section) => {
            return (
            <Accordion key={section.name} defaultExpanded>
              <AccordionSummary
                style={{padding: "0 10px", backgroundColor: 'var(--background-light)'}}
                expandIcon={<ExpandMoreIcon />}>
                <h3><b>{section.name}</b></h3>
              </AccordionSummary>
              <AccordionDetails style={{maxHeight: "350px", overflow: "scroll", padding: "5px"}}>
                {section.sectionContent}
              </AccordionDetails>
            </Accordion>
            )
          })
        }
        </Box>
        <Box ml={1} width="65%">
        <Accordion defaultExpanded>
          <AccordionSummary
            style={{padding: "0 10px", backgroundColor: 'var(--background-light)'}}
            expandIcon={<ExpandMoreIcon />}>
              <h3><b>Interactions</b></h3>
          </AccordionSummary>
          <AccordionDetails>
            {/* <DrugRecordTable /> */}
            {/* <InteractionTable interactionResults={interactionResults} isLoading={isLoading} recordType='drug' /> */}
          </AccordionDetails>
        </Accordion>
        </Box>
      </Box>
    </Box>
  )
};