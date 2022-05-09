// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ColumnsType } from 'antd/es/table';

// styles
import './InteractionTable.scss';
import { Skeleton, Table } from 'antd';

export const InteractionTable: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const { data, isError, isLoading } = useGetInteractionsByGenes(state.searchTerms);
  
  let genes = data?.genes;

  useEffect(() => {
    let interactionData: any = [];
    genes?.forEach((gene: any) => {
      gene.interactions.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setInteractionResults(interactionData)
  }, [genes])


  const columns: ColumnsType<any> = [
    {
      title: 'Gene',
      dataIndex: ['gene', 'name'],
      render: (text: any, record: any) => (
        <span>{record?.gene?.name}</span>
      )
    },
    {
      title: 'Drug',
      dataIndex: ['drug', 'name'],
      render: (text: any, record: any) => (
        <span>{record?.drug?.name}</span>
      )
    },
    {
      title: 'Approved',
      dataIndex: ['drug', 'approved'],
      render: (text: any, record: any) => (
        <span>{record?.drug?.approved ? 'Approved' : 'Not Approved'}</span>
      )
    },
    {
      title: 'Interaction Score',
      dataIndex: ['interactionScore'],
      render: (text: any, record: any) => (
        <span>{record?.interactionScore}</span>
      )
    },
  ]

  // if (isError || isLoading) {
  //   return (
  //     <div className="interaction-table--container">
  //       {isError && <div>Error: Interactions not found!</div>}
  //       {isLoading && <div>Loading...</div>}
  //     </div>
  //   )
  // }

  return (
    <div className="interaction-table-container">
      <span>
        <h3>Interaction Results</h3>
        {interactionResults ? <span id="interaction-count">{interactionResults.length} total interactions</span> : null}
      </span>
      <Skeleton loading={!interactionResults.length}>
        <Table 
          dataSource={interactionResults}
          columns={columns}
          rowKey={(record, index) => `${index}`}
          pagination={{ pageSize: 20}}
        />
      </Skeleton>
    </div>
  )
};