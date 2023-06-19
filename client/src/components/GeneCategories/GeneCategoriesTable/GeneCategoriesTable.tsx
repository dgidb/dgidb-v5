import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import './GeneCategoriesTable.scss';
import { Box } from '@mui/material';
import { SourceChip } from 'components/Shared/SourceChip/SourceChip';

interface Props {
  categoriesResults: any[];
}

export const GeneCategoriesTable: React.FC<Props> = ({ categoriesResults }) => {
  const columns: GridColDef[] = [
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.3,
    },
    {
      field: 'sources',
      headerName: 'Sources',
      flex: 1,
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Box className="source-chip-box">
            {params.row.sources.map((source: string) => (
              <SourceChip source={source} />
            ))}
          </Box>
        );
      },
    },
  ];

  const rows: GridRowsProp = categoriesResults?.map((catResult: any) => ({
    id: catResult.name,
    category: catResult.name,
    sources: catResult.sourceNames,
  }));

  return (
    <DataGrid
      columnHeaderHeight={45}
      autoHeight
      columns={columns}
      rows={rows}
      className="categories-data-grid"
      hideFooter
      classes={{
        columnHeader: 'categories-table-header',
        menuIcon: 'categories-column-menu-button',
        cell: 'categories-table-cell',
      }}
      getRowHeight={() => 'auto'}
      sx={{
        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '5px' },
      }}
    />
  );
};
