// hooks/dependencies
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './AmbiguousTerms.scss';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';
import InteractionTable from '../InteractionTable/InteractionTable';

interface Props {
  ambiguousTermData: any;
  resultType: string;
}

export const AmbiguousResult: React.FC<Props> = ({ambiguousTermData, resultType}) => {
  const [selectedTerm, setSelectedTerm] = useState<string[]>([]);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTerm([event.target.value as string]);
  };
  // this is hardcoded for genes since drugs cannot have ambiguous terms at the moment
  const { data, isLoading } = useGetInteractionsByGenes(
    selectedTerm
  );

  const genes = data?.genes?.nodes

  useEffect(() => {
    let interactionData: any = [];
      genes?.forEach((gene: any) => {
        gene.interactions.forEach((int: any) => {
          interactionData.push(int)
        })
      })
    setInteractionResults(interactionData)
  }, [genes])

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        style={{
          backgroundColor: 'var(--background-light)',
          margin: 0
        }}
        expandIcon={<ExpandMoreIcon />}
        classes={{content: 'accordion-summary'}}
      >
        <Box display='flex' alignItems='center'>
          <h3 style={{marginTop: '6px'}}><b>Search Term: "{ambiguousTermData.searchTerm}"</b></h3>
          <Box px='2px' display='flex' alignItems='center'><ArrowRightIcon /></Box>
          <Select onChange={handleChange} 
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()} 
            value={selectedTerm[0] || ''} 
            variant='standard' 
            label='Select...' 
            sx={{ m: 1, minWidth: 120 }}
          >
            {ambiguousTermData?.matches?.map((match: any) => 
              {
                return <MenuItem key={match.name} value={match.name}>{match.name}</MenuItem>
              })
            }
          </Select>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        style={{
          backgroundColor: 'var(--soft-background)',
      }}>
        <Box>
          {selectedTerm?.length > 0 ? <InteractionTable interactionResults={interactionResults} isLoading={isLoading} />
          : <Box><em>{ambiguousTermData.searchTerm} is ambiguous. Please select context from drop down.</em></Box>
          }
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AmbiguousResult;
