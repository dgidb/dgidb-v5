// hooks/dependencies
import React, { useEffect, useState } from 'react';
import { useGetGenesForCategory } from 'hooks/queries/useGetGenesForCategory';

// styles
import './BrowseCategoriesGenesTable.scss';
import { Box } from '@mui/system';
import { Skeleton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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

  const columns = [ 
    { 
      field: 'gene', 
      headerName: 'Gene', 
      flex: 0.5, 
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/genes/${params.row.gene}`}>{params.row.gene}</a>,
    },
    { 
      field: 'geneDescription', 
      headerName: 'Gene Description', 
      flex: 1, 
      minWidth: 0,
    },
    { 
      field: 'sources', 
      headerName: 'Sources', 
      flex: 0.75, 
      minWidth: 0,
    },
  ]

  const rows = genesInCategory?.map((geneInCategory: any) => {
    return {
      id: geneInCategory.id,
      gene: geneInCategory.gene.name,
      geneDescription: geneInCategory.gene.description,
      sources: geneInCategory.gene.sources?.join(', ')
    }
  })

  if (isLoading) {
    return (
      <Box className='loading'>
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
    <Box className='gene-list-table-container'>
      <Box width='100%' height='500px' display='flex'>
      <DataGrid
        columns={columns} 
        rows={rows} 
        pagination
        pageSizeOptions={[25, 50, 100]}
        className='data-grid'
        classes={{columnHeader: 'table-header', row: 'table-row', menuIcon: 'column-menu-button', cell: 'table-cell', footerContainer: 'table-cell'}}
        rowSelection={false}
        showColumnVerticalBorder
        />
        </Box>
    </Box>
  );
};
