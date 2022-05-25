// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByDrugs } from 'hooks/queries/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './DrugTable.scss';
import { Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const DrugTable: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const { data } = useGetInteractionsByDrugs(state.searchTerms);
  
  let drugs = data?.drugs;

  useEffect(() => {
    let interactionData: any = [];
    drugs?.forEach((drug: any) => {
      drug.interactions.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setInteractionResults(interactionData)
  }, [drugs])

  const columns: ColumnsType<any> = [
    {
      title: 'Drug',
      dataIndex: ['name'],
      render: (text: any, record: any) => (
        <span>{record?.drug?.name}</span>
      )
    },
    {
      title: 'Gene',
      dataIndex: ['gene', 'name'],
      render: (text: any, record: any) => (
        <span>{record?.gene?.name}</span>
      )
    },
    {
      title: 'Interaction Score',
      dataIndex: ['interactionScore'],
      render: (text: any, record: any) => (
        <span>{truncateDecimals(record?.interactionScore, 2)}</span>
      )
    },
    {
      title: 'Query Score',
      dataIndex: ['queryScore'],
      render: (text: any, record: any) => (
        <span></span>
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
