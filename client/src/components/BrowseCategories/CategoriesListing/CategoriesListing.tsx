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
  checkedSources: string[];
  sourcesLoaded: boolean;
}

type CategoryHeaderData = {
  name: string;
  geneCount: number;
};

export const CategoriesListing: React.FC<Props> = ({ checkedSources, sourcesLoaded }) => {
  const [renderedCategories, setRenderedCategories] = useState<CategoryHeaderData[]>([]);

  const { data, isLoading, isError } = useGetGeneCountsForCategories(checkedSources, sourcesLoaded);
  const categoriesData = data?.categories?.nodes

  useEffect(() => {
    setRenderedCategories(categoriesData || []);
  }, [categoriesData])

  return <>{renderedCategories.map((s: any, index: number) => <Box key={index}>{JSON.stringify(s)}</Box>)}</>
}

// export const CategoriesListing: React.FC<Props> = ({ sources, checkedSources }) => {
//   const [renderedCategories, setRenderedCategories] = useState<
//     CategoryHeaderData[]
//   >([]);

//   const { data, isLoading, isError } = useGetGeneCountsForCategories(
//     checkedSources,
//     true
//   );
//   const categories = data?.categories?.nodes;

//   useEffect(() => {
//     console.log(`use effect fired: ${categories}`);
//     if (categories) {
//       setRenderedCategories(categories);
//     }
//   }, [categories]);

//   return (
//     <>
//       {isError ? (
//         <ErrorMessage />
//       ) : isLoading ? (
//         <LoadingSpinner />
//       ) : renderedCategories?.length === 0 ? (
//         <Typography variant="h6" className="empty-msg">
//           No categorized genes found.
//         </Typography>
//       ) : (
//         <Box boxShadow={3}>
//           {renderedCategories
//             ?.filter((cat: any) => cat.geneCount > 0)
//             .map((cat: any, index: number) => {
//               return (
//                 <Accordion
//                   TransitionProps={{ unmountOnExit: true }}
//                   disableGutters
//                   key={index}
//                 >
//                   <AccordionSummary
//                     style={{ padding: '0 10px' }}
//                     expandIcon={<ExpandMoreIcon />}
//                   >
//                     {`${cat.name} (${cat.geneCount.toLocaleString(
//                       'en-US'
//                     )} genes)`}
//                   </AccordionSummary>
//                   <AccordionDetails
//                     style={{ overflow: 'scroll', padding: '0 10px 10px' }}
//                   >
//                     <CategoryTable
//                       categoryName={cat.name}
//                       sourceDbNames={checkedSources}
//                     />
//                   </AccordionDetails>
//                 </Accordion>
//               );
//             })}
//         </Box>
//       )}
//     </>
//   );
// };
