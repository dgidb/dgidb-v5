// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByDrugs} from 'hooks/queries/useGetInteractions';
import { useGetDrugRecord } from 'hooks/queries/useGetDrugRecord';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './DrugRecord.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

const DrugRecordTable: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const drugName = useParams().drug

  const { data } = useGetInteractionsByDrugs([drugName!]);

  let drugs = data?.drugs?.[0]?.interactions;

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
    // {
    //   title: 'PMIDs',
    //   dataIndex: ['sources'],
    //   render: (text: any, record: any) => (
    //     <span>{record?.sources.length}</span>
    //   )
    // },
    // {
    //   title: 'Sources',
    //   dataIndex: ['interactionScore'],
    //   render: (text: any, record: any) => (
    //     <span>{truncateDecimals(record?.interactionScore, 2)}</span>
    //   )
    // },
    {
      title: 'Interaction Score',
      dataIndex: ['interactionScore'],
      render: (text: any, record: any) => (
        <span>{truncateDecimals(record?.interactionScore, 2)}</span>
      )
    },
  ]

  return (
    <div className="gene-record-interactions">
      <Table
        dataSource={interactionResults}
        columns={columns}
        rowKey={(record, index) => `${index}`}
        pagination={{ pageSize: 10}}
      />
    </div>
  )
};

export const DrugRecord: React.FC = () => {

  const drug = useParams().drug as string;
  const data = useGetDrugRecord([drug]).data;
  let drugData = data?.drugs[0];

  return (
    <div className="drug-record-container">
      <div className="drug-record-header"><h1>{drug}</h1></div>
      <div className="drug-record-upper">
        <div className="data-box drug-record-info">
          <div className="box-title">Drug Info</div>
          <div className="box-content">
            <table>
              <tbody>
              {drugData?.drugAttributes?.map((attribute: any) => {
                return (
                  <tr>
                    <td>{attribute.name}:</td>
                    <td>{attribute.value}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="data-box drug-record-approval">
          <div className="box-title">Categories</div>
          <div className="box-content">
            {drugData?.geneCategories?.map((category: any) => {
              return <div>{category?.name}</div>
            })}
          </div>
        </div>
      </div>
      <div className="drug-record-lower">
        <div className="data-box drug-record-aliases">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <b>Aliases</b>
            </AccordionSummary>
            <AccordionDetails>
              {drugData?.drugAliases?.map((alias: any) => {
              return <div>{alias?.alias}</div>
              })}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="data-box drug-record-active">
          <div className="box-title">Active</div>
          <div className="box-content">
            {drugData?.drugAliases?.map((alias: any) => {
              return <div>{alias?.alias}</div>
            })}
          </div>
        </div>
        <div className="data-box drug-record-publications">
          <div className="box-title">Publications</div>
          <div className="box-content">
            {drugData?.geneClaims?.map((claim: any) => {
              return <div>{claim?.source?.citation}</div>
            })}
          </div>
        </div>
        <div className="data-box drug-record-table">
          <div className="box-title">Interactions</div>
          <div className="box-content">
            <DrugRecordTable />
          </div>
        </div>
      </div>
    </div>
  )
};