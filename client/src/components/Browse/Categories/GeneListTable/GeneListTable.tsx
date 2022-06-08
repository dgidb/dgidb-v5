// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useGetDruggableSources } from 'hooks/queries/useGetDruggableSources';
import { Collapse } from 'antd';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './GeneListTable.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const GeneListTable: React.FC = () => {
  let [sources, setSources] = useState<any>([])

  const { data } = useGetDruggableSources("POTENTIALLY_DRUGGABLE")

  interface Categories {
    [key: string]: number
  }

  return (
    <div className="gene-list-table-container">
      {/* <Table
        dataSource={interactionResults}
        columns={columns}
        rowKey={(record, index) => `${index}`}
        pagination={{ pageSize: 20}}
      /> */}
    </div>
  )
};
