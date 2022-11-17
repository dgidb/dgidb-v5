// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useGetDruggableSources } from 'hooks/queries/useGetDruggableSources';
import { useGetGeneList } from 'hooks/queries/useGetGeneList';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './GeneListTable.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const GeneListTable: React.FC = () => {

  const { data } = useGetGeneList(["ENZYME"])

  const [interactionResults, setInteractionResults] = useState<any[]>([
    {gene: { name: 'ABCB11', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 11', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB12', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 12', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB13', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 13', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB14', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 14', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB15', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 15', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB16', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 16', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB17', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 17', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB18', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 18', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB19', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 19', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB100', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 20', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB111', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 21', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB112', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 22', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB113', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 23', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB114', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 24', sources: ['HopkinsGroom', 'Go']}},
    {gene: { name: 'ABCB115', description: 'ATP BINDING CASSETTE SUBFAMILY B MEMBER 25', sources: ['HopkinsGroom', 'Go']}}
  ]);

  interface Categories {
    [key: string]: number
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Gene',
      dataIndex: ['gene', 'name'],
      render: (text: any, record: any) => (
        <span>{record.gene.name}</span>
      ),
    },
    {
      title: 'Gene Description',
      dataIndex: ['gene', 'description'],
      render: (text: any, record: any) => (
        <span>{record.gene.description}</span>
      ),
    },
    {
      title: 'Sources',
      dataIndex: ['gene', 'sources'],
      render: (text: any, record: any) => (
        record.gene.sources.map((src: any) => {
          return <span>{src}, </span>
        })
      ),
    },
  ]

  return (
    <div className="gene-list-table-container">
      <Table
        dataSource={interactionResults}
        size="small"
        columns={columns}
        rowKey={(record, index) => `${index}`}
        pagination={{ pageSize: 10}}
      />
    </div>
  )
};
