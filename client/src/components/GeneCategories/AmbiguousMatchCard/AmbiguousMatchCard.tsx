import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { GeneCategoriesTable } from '../GeneCategoriesTable/GeneCategoriesTable';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import './AmbiguousMatchCard.scss';

interface Props {
  match: any;
}

export const AmbiguousMatchesCard: React.FC<Props> = ({ match }) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTerm(event.target.value as string);
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className="ambig-result-container-header"
        classes={{ content: 'cats-ambig-accordion-summary' }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h6">
            Search Term: "{match.searchTerm}"
          </Typography>
          <Box px="2px" display="flex" alignItems="center">
            <ArrowRightIcon />
          </Box>
          <Select
            onChange={handleChange}
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            value={selectedTerm || ''}
            variant="standard"
            label="Select..."
            sx={{ m: 1, minWidth: 120 }}
          >
            {match?.matches.map((potentialMatch: any) => (
              <MenuItem key={potentialMatch.name} value={potentialMatch.name}>
                {potentialMatch.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </AccordionSummary>
      <AccordionDetails className="ambig-result-container">
        {selectedTerm.length > 0 ? (
          <Box className="categories-table-container">
            <GeneCategoriesTable
              categoriesResults={
                match.matches.find((item: any) => item.name === selectedTerm)
                  .geneCategoriesWithSources
              }
            />
          </Box>
        ) : (
          <Typography fontStyle="italic">
            {match.searchTerm} is ambiguous. Please select context from drop
            down.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
