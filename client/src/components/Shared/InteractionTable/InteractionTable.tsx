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
  searchTerms: string[];
  displayHeader?: boolean;
}

export const InteractionTable: React.FC<Props> = ({searchTerms, displayHeader=true}) => {
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const { data, isLoading } = useGetInteractionsByGenes(searchTerms)
  const [searchParams] = useSearchParams();

  let genes = data?.genes?.nodes;
  let drugs = data?.drugs?.nodes

  useEffect(() => {
    let interactionData: any = [];
    if (searchParams.get('searchType') === 'gene') {
      genes?.forEach((gene: any) => {
        gene.interactions.forEach((int: any) => {
          interactionData.push(int)
        })
      }) 
    }
    else if (searchParams.get('searchType') === 'drug') {
      drugs?.forEach((drug: any) => {
        drug.interactions.forEach((int: any) => {
          interactionData.push(int)
        })
      }) 
    }
    setInteractionResults(interactionData)
  }, [genes, drugs, searchTerms, searchParams])

  const columns = [
    { 
      field: 'gene', 
      headerName: 'Gene', 
      flex: 0.5, 
      renderCell: (params: any) => 
        <a href={`/genes/${params.row.gene}`}>{params.row.gene}</a>,
    },
    { 
      field: 'drug', 
      headerName: 'Drug', 
      flex: 1.3,
      renderCell: (params: any) => 
        <a href={`/drugs/${params.row.drug}`}>{params.row.drug}</a>,
    },
    {
      field: 'regulatoryApproval',
      headerName: 'Regulatory Approval', flex: 0.8,
    },
    {
      field: 'indication',
      headerName: 'Indication', flex: 1,
    },
    {
      field: 'interactionScore',
      headerName: 'Interaction Score', flex: 0.6,
    },
  ];

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
      {
        displayHeader && 
        <span>
          <h3>Interaction Results</h3>
          <span id='interaction-count'>{interactionResults.length} total interactions</span>
        </span>
      }
      <Box width="100%" height="500px" display="flex">
      <DataGrid
        columns={columns} 
        rows={rows} 
        pagination
        pageSizeOptions={[25, 50, 100]}
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