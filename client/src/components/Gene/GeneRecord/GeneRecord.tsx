// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './GeneRecord.scss';
import { Table as AntTable } from 'antd';
import { ColumnsType } from 'antd/es/table';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const GeneRecordTable: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const geneSymbol: any = useParams().gene;

  const { data } = useGetInteractionsByGenes([geneSymbol]);

  let genes = data?.genes;

  useEffect(() => {
    let interactionData = genes?.find((gene: any) => {
      return gene.name === geneSymbol
    })

    setInteractionResults(interactionData?.interactions)
  }, [genes])

  const columns: ColumnsType<any> = [
    {
      title: 'Drug',
      dataIndex: ['drug', 'name'],
      render: (text: any, record: any) => (
        <a href={`/drugs/${record?.drug?.name}`}>{record?.drug?.name}</a>
      )
    },
    {
      title: 'Interaction Types',
      dataIndex: ['interactionTypes'],
      render: (text: any, record: any) => {
        return record?.interactionTypes.map((int: any) => {
          return <span>{int?.type}</span>
        })
      }
    },
    {
      title: 'PMIDs',
      dataIndex: ['publications'],
      render: (text: any, record: any) => (
        <span>{record?.publications?.length}</span>
      )
    },
    {
      title: 'Sources',
      dataIndex: ['sources'],
      render: (text: any, record: any) => (
        <span>{record?.sources.length}</span>
      )
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
        rowKey={(record, index) => `${index}`}
        pagination={{ pageSize: 10}}
      />
    </Box>
  )
};

export const GeneRecord: React.FC = () => {

  const geneSymbol = useParams().gene;

  const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  const geneInfoTable = (
    <Table>
      <TableBody>
        {data?.gene?.geneAttributes?.map((attribute: any) => {
          return (
            <TableRow key={attribute.name + " " + attribute.value}>
                <TableCell className="attribute-name">{attribute.name}:</TableCell>
                  <TableCell className="attribute-value">{attribute.value}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  )

  const categoriesTable = (
    <Table>
      <TableBody>
        {data?.gene?.geneCategories?.map((category: any) => {
          return (
            <TableRow key={category.name + " " + category.value}>
                <TableCell className="attribute-name">{category.name}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  )

  const aliasesTable = (
    <Table>
      <TableBody>
        {data?.gene?.geneAliases?.map((alias: any) => {
          return (
            <TableRow key={alias.alias}>
                <TableCell className="attribute-name">{alias.alias}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  )

  const publicationsTable = (
    <Table>
      <TableBody>
        {data?.gene?.geneClaims?.map((claim: any) => {
          return (
            <TableRow key={claim?.source?.citation}>
                <TableCell className="attribute-name">{claim?.source?.citation}</TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  )

  const sectionsMap = [
    {
      name: "Gene Info",
      sectionContent: (
        <Box className="box-content">
            {geneInfoTable}
          </Box>
      ),
    },
    {
      name: "Aliases",
      sectionContent: (
        <Box className="box-content">
            {aliasesTable}
          </Box>
      ),
    },
    {
      name: "Categories",
      sectionContent: (
        <Box className="box-content">
            {categoriesTable}
          </Box>
      ),
    },
    {
      name: "Publications",
      sectionContent: (
        <Box className="box-content publication-item">
            {publicationsTable}
          </Box>
      ),
    },
  ]

  return (
    <Box className="content gene-record-container">
      <Box className="gene-record-header"><h1><b>{geneSymbol}</b></h1></Box>
      <Box display="flex">
        <Box display="block" width="45%">
          {
          sectionsMap.map((section) => {
            return (
            <Accordion key={section.name} defaultExpanded>
              <AccordionSummary
                style={{padding: "0 10px", backgroundColor: 'var(--background-light)'}}
                expandIcon={<ExpandMoreIcon />}>
                <h3><b>{section.name}</b></h3>
              </AccordionSummary>
              <AccordionDetails style={{maxHeight: "350px", overflow: "scroll", padding: "0 10px 10px"}}>
                {section.sectionContent}
              </AccordionDetails>
            </Accordion>
            )
          })
        }
        </Box>
        <Box ml={1}>
        <Accordion defaultExpanded>
          <AccordionSummary
            style={{padding: "0 10px", backgroundColor: 'var(--background-light)'}}
            expandIcon={<ExpandMoreIcon />}>
              <h3><b>Interactions</b></h3>
          </AccordionSummary>
          <AccordionDetails>
            <GeneRecordTable />
          </AccordionDetails>
        </Accordion>
        </Box>
      </Box>
    </Box>
  )
};

export const GeneRecordContainer: React.FC = () => {
  return (
    <>
      <GeneRecord />
    </>
  )
};

