// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetDrugRecord } from 'hooks/queries/useGetDrugRecord';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './DrugRecord.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

const DrugRecordTable: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const geneSymbol = 'FLT1'

  const { data, isError, isLoading } = useGetInteractionsByGenes(["FLT1"]);

  useEffect(() => {
    console.log('intdainteractionResultsta', interactionResults);
  }, [interactionResults])

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
        <span>{record?.drug?.name}</span>
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
    <div className="gene-record-interactions">
      <Table
        dataSource={interactionResults}
        columns={columns}
        rowKey={(record, index) => `${index}`}
        pagination={{ pageSize: 15}}
      />
    </div>
  )
};

export const DrugRecord: React.FC = () => {

  const drug = useParams().drug;

  const { data, isError, isLoading } = useGetDrugRecord([drug!]);

  return (
    <div className="drug-record-container">
      <div className="drug-record-header">{drug}</div>
      <div className="drug-record-upper">
        <div className="data-box drug-record-info">
          <div className="box-title">Drug Info</div>
          <div className="box-content">
            <table>
              <tbody>
              {data?.drug?.geneAttributes?.map((attribute: any) => {
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
            {data?.drug?.geneCategories?.map((category: any) => {
              return <div>{category?.name}</div>
            })}
          </div>
        </div>
      </div>
      <div className="drug-record-lower">
        <div className="data-box drug-record-aliases">
          <div className="box-title">Aliases</div>
          <div className="box-content">
            {data?.drug?.drugAliases?.map((alias: any) => {
              return <div>{alias?.name}</div>
            })}
          </div>
        </div>
        <div className="data-box drug-record-active">
          <div className="box-title">Aliases</div>
          <div className="box-content">
            {data?.drug?.drugAliases?.map((alias: any) => {
              return <div>{alias?.name}</div>
            })}
          </div>
        </div>
        <div className="data-box drug-record-publications">
          <div className="box-title">Publications</div>
          <div className="box-content">
            {data?.gene?.geneClaims?.map((claim: any) => {
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