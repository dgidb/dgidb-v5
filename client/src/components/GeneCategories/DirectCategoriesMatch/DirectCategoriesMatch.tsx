import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  Typography,
} from '@mui/material';
import { GeneCategoriesTable } from '../GeneCategoriesTable/GeneCategoriesTable';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './DirectCategoriesMatch.scss';

interface Props {
  matchResult: any; // TODO
}

export const DirectCategoriesMatch: React.FC<Props> = ({ matchResult }) => {
  return (
    <Accordion defaultExpanded disableGutters square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" className="cats-match-header">
          Search Term: "{matchResult.searchTerm}" {'\u25B6 '}
          <Link
            className="cats-gene-link"
            href={`/genes/${matchResult.matches[0].conceptId}`}
          >
            {matchResult.matches[0].name}
          </Link>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box className="cats-accordion-container">
          <GeneCategoriesTable
            categoriesResults={matchResult.matches[0].geneCategoriesWithSources}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
