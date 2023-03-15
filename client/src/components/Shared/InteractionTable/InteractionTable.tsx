// hooks/dependencies
import React, {useState, useEffect} from 'react';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';

// styles
import './InteractionTable.scss';
import { Box, CircularProgress, Icon } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { truncateDecimals } from 'utils/format';
import { useSearchParams } from 'react-router-dom';

interface Props {
  isLoading: boolean;
  interactionResults: any;
}

export const InteractionTable: React.FC<Props> = ({interactionResults, isLoading}) => {
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get('searchType')

  const geneColumns = [
    { 
      field: 'gene', 
      headerName: 'Gene', 
      flex: 0.5, 
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/genes/${params.row.gene}`}>{params.row.gene}</a>,
    },
    { 
      field: 'drug', 
      headerName: 'Drug', 
      flex: 1.3,
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/drugs/${params.row.drug}`}>{params.row.drug}</a>,
    },
  ]

  const drugColumns = [
    { 
      field: 'drug', 
      headerName: 'Drug', 
      flex: 1.3,
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/drugs/${params.row.drug}`}>{params.row.drug}</a>,
    },
    { 
      field: 'gene', 
      headerName: 'Gene', 
      flex: 0.5, 
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/genes/${params.row.gene}`}>{params.row.gene}</a>,
    },
  ]

  const commonColumns = [
    {
      field: 'regulatoryApproval',
      headerName: 'Regulatory Approval', flex: 0.8, minWidth: 0,
    },
    {
      field: 'indication',
      headerName: 'Indication', flex: 1, minWidth: 0,
    },
    {
      field: 'interactionScore',
      headerName: 'Interaction Score', flex: 0.6, minWidth: 0,
    },
  ];

  const columns = searchType === 'gene' ? [...geneColumns, ...commonColumns] : [...drugColumns, ...commonColumns]

  const rows = interactionResults?.map((interaction: any, index: number) => {
    return {
      id: index, 
      gene: interaction?.gene?.name,
      drug: interaction?.drug?.name,
      regulatoryApproval: interaction?.drug?.approved ? 'Approved' : 'Not Approved',
      indication: interaction?.drug?.drugAttributes?.filter((attribute: any) => {
        return attribute.name === 'Drug Indications'
      })?.[0]?.value,
      interactionScore: truncateDecimals(interaction?.interactionScore, 2),
    }
  })

  return !isLoading ?
    <Box className='interaction-table-container'>
      <Box width="100%" height="500px" display="flex">
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
  : 
  <Box display='flex' mt='10px' alignItems='center'><h3>Loading interaction results...</h3>
    <Icon component={CircularProgress} baseClassName='loading-spinner' fontSize='small'></Icon>
  </Box>
};

export default InteractionTable;