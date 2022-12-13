// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './GeneRecord.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

const GeneRecordTable: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const navigate = useNavigate();
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
        <a onClick={() => navigate(`/drugs/${record?.drug?.name}`)}>{record?.drug?.name}</a>
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

export const GeneRecord: React.FC = () => {

  const geneSymbol = useParams().gene;

  const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  return (
    <div className="content gene-record-container">
      <div className="gene-record-header">{geneSymbol}</div>
      <div className="gene-record-upper">
        <div className="data-box gene-record-info">
          <div className="box-title">Gene Info</div>
          <div className="box-content">
            <table>
              <tbody>
              {data?.gene?.geneAttributes?.map((attribute: any) => {
                return (
                  <tr>
                    <td className="attribute-name">{attribute.name}:</td>
                    <td className="attribute-value">{attribute.value}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="data-box gene-record-categories">
          <div className="box-title">Categories</div>
          <div className="box-content">
            {data?.gene?.geneCategories?.map((category: any) => {
              return <div className="box-item">{category?.name}</div>
            })}
          </div>
        </div>
      </div>
      <div className="gene-record-lower">
        <div className="data-box gene-record-aliases">
          <div className="box-title">Aliases</div>
          <div className="box-content">
            {data?.gene?.geneAliases?.map((alias: any) => {
              return <div className="box-item">{alias?.alias}</div>
            })}
          </div>
        </div>
        <div className="data-box gene-record-publications">
          <div className="box-title">Publications</div>
          <div className="box-content publication-item">
            {data?.gene?.geneClaims?.map((claim: any) => {
              return <div className="box-link">{claim?.source?.citation}</div>
            })}
          </div>
        </div>
        <div className="data-box gene-record-table">
          <div className="box-title">Interactions</div>
          <div className="box-content">
            <GeneRecordTable />
          </div>
        </div>
      </div>
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

