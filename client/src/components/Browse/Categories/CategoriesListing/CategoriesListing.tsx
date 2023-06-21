import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { ErrorMessage } from 'components/Shared/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from 'components/Shared/LoadingSpinner/LoadingSpinner';
import { useGetGeneCountsForCategories } from 'hooks/queries/useGetGeneCountsForCategories';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CategoryTable } from '../CategoryTable/CategoryTable';

interface Props {
  sources: string[];
}

type CategoryHeaderData = {
  name: string;
  geneCount: number;
};

export const CategoriesListing: React.FC<Props> = ({ sources }) => {
  const [renderedCategories, setRenderedCategories] = useState<
    CategoryHeaderData[]
  >([]);

  const { data, isLoading, isError } = useGetGeneCountsForCategories(
    sources,
    sources.length > 0
  );

  useEffect(() => {
    if (data?.categories?.nodes) {
      setRenderedCategories(data.categories.nodes);
    }
  }, [data]);

  return (
    <>
      {isError ? (
        <ErrorMessage />
      ) : isLoading ? (
        <LoadingSpinner />
      ) : renderedCategories?.length === 0 ? (
        <Typography variant="h6" className="empty-msg">
          No categorized genes found.
        </Typography>
      ) : (
        <Box boxShadow={3}>
          {renderedCategories
            ?.filter((cat: any) => cat.geneCount > 0)
            .map((cat: any, index: number) => {
              return (
                <Accordion
                  TransitionProps={{ unmountOnExit: true }}
                  disableGutters
                  key={index}
                >
                  <AccordionSummary
                    style={{ padding: '0 10px' }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    {`${cat.name} (${cat.geneCount.toLocaleString(
                      'en-US'
                    )} genes)`}
                  </AccordionSummary>
                  <AccordionDetails
                    style={{ overflow: 'scroll', padding: '0 10px 10px' }}
                  >
                    <CategoryTable
                      categoryName={cat.name}
                      sourceDbNames={sources}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Box>
      )}
    </>
  );
};
