// hooks/dependencies
import React from 'react';

// styles
import './InteractionTable.scss';
import { Box, CircularProgress, Icon } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { truncateDecimals } from 'utils/format';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PublicationsTooltip, SourcesTooltip } from '../Tooltip/Tooltip';

interface Props {
  isLoading: boolean;
  interactionResults: any;
  recordType?: string;
}

export const InteractionTable: React.FC<Props> = ({interactionResults, isLoading, recordType=''}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchType = searchParams.get('searchType')

  const geneColumn = 
    { 
      field: 'gene', 
      headerName: 'Gene', 
      flex: 0.5, 
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/genes/${params.row.gene}`} onClick={(event) => event.stopPropagation()}>{params.row.gene}</a>,
    }

  const drugColumn = 
    { 
      field: 'drug', 
      headerName: 'Drug', 
      flex: 1,
      minWidth: 0,
      renderCell: (params: any) => 
        <a href={`/drugs/${params.row.drug}`} onClick={(event) => event.stopPropagation()}>{params.row.drug}</a>,
    }

  const searchColumns = [
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

  const recordColumns = [
    {
      field: 'interactionTypes',
      headerName: 'Interaction Types', flex: 1, minWidth: 0,
    },
    {
      field: 'pmids',
      headerName: 'PMIDs', flex: 0.4, minWidth: 0,
      renderCell: (params: any) => 
      <PublicationsTooltip displayText={params.row.pmids?.length} hoverTexts={params.row.pmids}></PublicationsTooltip>,
    },
    {
      field: 'sources',
      headerName: 'Sources', flex: 0.4, minWidth: 0,
      renderCell: (params: any) =>
        <SourcesTooltip hoverTexts={params.row.sources} displayText={params.row.sources?.length}></SourcesTooltip>
    },
    {
      field: 'interactionScore',
      headerName: 'Interaction Score', flex: 0.6, minWidth: 0,
    },
  ]

  let columns: any = []

  if (searchType === 'gene') {
    columns = [geneColumn, drugColumn, ...searchColumns]
  } else if (searchType === 'drug') {
    columns = [drugColumn, geneColumn, ...searchColumns]
  } else if (recordType === 'gene') {
    columns = [drugColumn, ...recordColumns]
  } else if (recordType === 'drug') {
    columns = [geneColumn, ...recordColumns]
  }

  const handleEvent = (event: any) => {
    navigate('/interactions/' + event.row.id)
  }

  const rows = interactionResults?.map((interaction: any, index: number) => {
    return {
      id: interaction.id, 
      gene: interaction?.gene?.name,
      drug: interaction?.drug?.name,
      regulatoryApproval: interaction?.drug?.approved ? 'Approved' : 'Not Approved',
      indication: interaction?.drug?.drugAttributes?.filter((attribute: any) => {
        return attribute.name === 'Drug Indications'
      })?.[0]?.value,
      interactionScore: truncateDecimals(interaction?.interactionScore, 2),
      interactionTypes: interaction?.interactionTypes.map((interaction: any) => {return interaction.type}).join(', '),
      pmids: interaction?.publications,
      sources: interaction?.sources
    }
  })

  return !isLoading ?
    <Box className='interaction-table-container'>
      <Box width="100%" height="500px" display="flex">
      <DataGrid
        onRowClick={handleEvent}
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
