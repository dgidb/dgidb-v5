// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { ColumnsType } from 'antd/es/table';
// components/
import SearchBar from '../../components/SearchBar/SearchBar';

// styles
import './results.page.scss';
import { Skeleton, Table } from 'antd';

export const Results: React.FC = () => {

  const {state} = useContext(GlobalClientContext);

  const [tableData, setTableData] = useState<any>([]);

	const { data, error, isError, isLoading, refetch} = useGetInteractionsByGenes(state.searchTerms);

  useEffect(() => {
    refetch();
  }, [state.searchTerms])
  
  let genes = data?.genes;

  useEffect(() => {
    let interactionData: any = [];
    genes.forEach((gene: any) => {
      gene.interactions.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setTableData([...interactionData])
  }, [genes])
    

  if (isLoading) {
    return <div className="results-page-container">loading...</div>
  }

  if (isError) {
    return <div className="results-page-container">Error: Interaction not found!</div>
  }


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
  return (
    <div className="results-page-container">
      <Table 
        dataSource={tableData}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 20}}
      />
    </div>
  )

};
