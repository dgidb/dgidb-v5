// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetGeneRecord, useGetInteractionsByGenes} from 'hooks/interactions/useGetInteractions';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './GeneRecord.scss';
import { Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';


const GeneRecordTable: React.FC = () => {

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
        console.log('recooooord', record)
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
        pagination={{ pageSize: 20}}
      />
    </div>
  )
};

export const GeneRecord: React.FC = () => {

  const geneSymbol = 'FLT1'

  const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  return (
    <div className="gene-record-container">
      <div className="gene-record-header">{geneSymbol}</div>
      <div className="gene-record-layout">
        <div className="box gene-record-info">
          <table>
            <tbody>
            {data?.gene?.geneAttributes?.map((attribute: any) => {
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
        <div className="box gene-record-aliases">
          {data?.gene?.geneAliases?.map((alias: any) => {
            return <div>{alias?.alias}</div>
          })}
        </div>
        <div className="box gene-record-publications">
          {data?.gene?.geneClaims?.map((claim: any) => {
            return <div>{claim?.source?.citation}</div>
          })}
        </div>
        <div className="box gene-record-categories">
          {data?.gene?.geneCategories?.map((category: any) => {
            return <div>{category?.name}</div>
          })}
        </div>
      </div>

        <GeneRecordTable />
    </div>
  )
};

export const GeneRecordContainer: React.FC = () => {
  return (
    <>
      <GeneRecord />
    </>
  )
};

