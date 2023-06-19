// hooks/dependencies
import React, { useEffect, useState } from 'react';
import { useGetGenesForCategory } from 'hooks/queries/useGetGenesForCategory';

// styles
import './BrowseCategoriesGenesTable.scss';
import { Box } from '@mui/system';
import { LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { SourceChip } from 'components/Shared/SourceChip/SourceChip';

interface BrowseCategoriesGenesTableProps {
  categoryName: String;
  sourceDbNames: String[];
}

export const BrowseCategoriesGenesTable: React.FC<
  BrowseCategoriesGenesTableProps
> = ({ categoryName, sourceDbNames }) => {
  const [genesInCategory, setGenesInCategory] = useState([]);

  const { data, isError, isLoading } = useGetGenesForCategory(
    categoryName,
    sourceDbNames
  );
  const genes = data?.geneClaimCategory?.genes?.edges;

  useEffect(() => {
    if (genes) {
      setGenesInCategory(
        genes.map((record: any, index: number) => ({
          id: index,
          gene: {
            name: record?.node?.name,
            conceptId: record?.node?.conceptId,
            description: record?.node?.longName,
            sources: record?.node?.sourceDbNames,
          },
        }))
      );
    }
  }, [genes]);

  const columns = [
    {
      field: 'gene',
      headerName: 'Gene',
      flex: 0.5,
      minWidth: 0,
      renderCell: (params: any) => (
        <a href={`/genes/${params.row.geneId}`}>{params.row.gene}</a>
      ),
    },
    {
      field: 'geneDescription',
      headerName: 'Gene Description',
      flex: 1.0,
      minWidth: 0,
    },
    {
      field: 'sources',
      headerName: 'Sources',
      flex: 1.0,
      minWidth: 0,
      renderCell: (params: any) => (
        <Box>
          {params.row.sources.map((source: string) => (
            <SourceChip source={source} />
          ))}
        </Box>
      ),
    },
  ];

  const rows = genesInCategory?.map((geneInCategory: any) => {
    return {
      id: geneInCategory.id,
      gene: geneInCategory.gene.name,
      geneId: geneInCategory.gene.conceptId,
      geneDescription: geneInCategory.gene.description,
      sources: geneInCategory.gene.sources || [],
    };
  });

  if (isError) {
    return <Box>Error! Unable to complete request</Box>;
  }
  return (
    <Box className="gene-list-table-container">
      <Box width="100%" height="500px" display="flex">
        <DataGrid
          columns={columns}
          rows={rows}
          pagination
          pageSizeOptions={[25, 50, 100]}
          className="data-grid"
          classes={{
            columnHeader: 'table-header',
            row: 'table-row',
            menuIcon: 'column-menu-button',
            cell: 'table-cell',
            footerContainer: 'table-cell',
          }}
          slots={{
            loadingOverlay: LinearProgress,
          }}
          rowSelection={false}
          showColumnVerticalBorder
          loading={isLoading}
          getRowHeight={() => 'auto'}
          getRowClassName={(params) => 'categorized-genes-data-rows'}
          sx={{
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
              py: '5px',
            },
          }}
        />
      </Box>
    </Box>
  );
};
