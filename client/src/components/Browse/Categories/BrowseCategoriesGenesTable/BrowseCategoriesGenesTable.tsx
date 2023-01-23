// hooks/dependencies
import React, { useEffect, useState } from "react";
import { useGetGenesForCategory } from "hooks/queries/useGetGenesForCategory";

// styles
import "./BrowseCategoriesGenesTable.scss";
// import { Table } from "antd";
// import { ColumnsType } from "antd/es/table";
import { Paper, Table, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

interface BrowseCategoriesGenesTableProps {
  categoryName: String;
  sourceDbNames: String[];
}

interface GeneTableRowProps {
  geneData: Object,
  key: number
}

export const BrowseCategoriesGenesTable: React.FC<
  BrowseCategoriesGenesTableProps
> = ({ categoryName, sourceDbNames }) => {
  const [genesInCategory, setGenesInCategory] = useState([]);

  const { data } = useGetGenesForCategory(categoryName, sourceDbNames);
  const genes = data?.geneClaimCategory?.genes?.edges

  useEffect(() => {
    if (genes) {
      console.log(genes);
      setGenesInCategory(genes);
    }
  }); // TODO set dependency?

  // const columns: ColumnsType<any> = [
  //   {
  //     title: "Gene",
  //     dataIndex: ["gene", "name"],
  //     render: (text: any, record: any) => <span>gene</span>,
  //   },
  //   {
  //     title: "Gene Description",
  //     dataIndex: ["gene", "description"],
  //     render: (text: any, record: any) => <span>description?</span>,
  //   },
  //   {
  //     title: "Sources",
  //     dataIndex: ["gene", "sources"],
  //     render: (text: any, record: any) =>
  //       record.gene.sources.map((src: any) => {
  //         return <span>src, </span>;
  //       }),
  //   },
  // ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const GeneTableRow: React.FC<GeneTableRowProps> = ({geneData, key}) => (
    <TableRow key={key}>
      <TableCell>geneData.name</TableCell>
      <TableCell>geneData.longName</TableCell>
      <TableCell>geneData.sources</TableCell>
    </TableRow>
  )

  return (
    <div className="gene-list-table-container">
      <TableContainer component={Paper}>
        <Table aria-label="genes for category table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sources</TableCell>
            </TableRow>
          </TableHead>
          {
            genesInCategory.map((g, i) => (
              <GeneTableRow  geneData={g} key={i} />
            ))
          }
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={genesInCategory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
