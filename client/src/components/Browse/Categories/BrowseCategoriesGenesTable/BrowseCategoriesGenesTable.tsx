// hooks/dependencies
import React, { useEffect, useState } from "react";
import { useGetGenesForCategory } from "hooks/queries/useGetGenesForCategory";

// styles
import "./BrowseCategoriesGenesTable.scss";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Box } from "@mui/system";
import { Skeleton } from "@mui/material";

interface BrowseCategoriesGenesTableProps {
  categoryName: String;
  sourceDbNames: String[];
}

export const BrowseCategoriesGenesTable: React.FC<
  BrowseCategoriesGenesTableProps
> = ({ categoryName, sourceDbNames }) => {
  const [genesInCategory, setGenesInCategory] = useState([]);

  const { data, isError, isLoading } = useGetGenesForCategory(categoryName, sourceDbNames);
  const genes = data?.geneClaimCategory?.genes?.edges;

  useEffect(() => {
    if (genes) {
      setGenesInCategory(genes.map((record: any, index: number) => (
        {
          id: index,
          gene: {
            name: record?.node?.name,
            description: record?.node?.longName,
            sources: record?.node?.sourceDbNames
          }
        }
      )));
    }
  }, [genes]);

  const columns: ColumnsType<any> = [
    {
      title: "Gene",
      dataIndex: ["gene", "name"],
      render: (text: any, record: any) => <a href={`/genes/${record?.gene?.name}`}>{record.gene.name}</a>,
    },
    {
      title: "Gene Description",
      dataIndex: ["gene", "description"],
      render: (text: any, record: any) => (
        <span>{record.gene.description}</span>
      ),
    },
    {
      title: "Sources",
      dataIndex: ["gene", "sources"],
      render: (text: any, record: any) =>
        record.gene.sources.map((src: any, i: number) => {
          return <span key={i}>{src}, </span>;
        }),
    },
  ];

  if (isLoading) {
    return (
      <Box className="loading">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Box>
    )
  }
   else if (isError) {
    return (<Box>Error! Unable to complete request</Box>)
  }
  return (
    <div className="gene-list-table-container">
      <Table
        dataSource={genesInCategory}
        size="small"
        columns={columns}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
