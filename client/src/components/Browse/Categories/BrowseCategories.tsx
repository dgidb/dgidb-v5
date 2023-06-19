// hooks/dependencies
import React, { useState, useEffect } from 'react';
import { useGetDruggableSources } from 'hooks/queries/useGetDruggableSources';

// components
import { BrowseCategoriesGenesTable } from 'components/Browse/Categories/BrowseCategoriesGenesTable';

// styles
import './BrowseCategories.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';

interface Categories {
  [key: string]: number;
}

export const BrowseCategories: React.FC = () => {
  const [plainOptions, setPlainOptions] = useState([]);

  const [checkedList, setCheckedList] = useState<any>([]);

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [renderedCategories, setRenderedCategories] = useState<any>([]);

  const { data } = useGetDruggableSources('POTENTIALLY_DRUGGABLE');

  useEffect(() => {
    if (data?.sources?.nodes) {
      let nodes = data?.sources?.nodes;
      let sources: any = [];

      nodes.forEach((node: any) => {
        sources.push(node.sourceDbName);
      });

      setPlainOptions(
        sources.sort((a: string, b: string) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
      );
    }
  }, [data]);

  useEffect(() => {
    if (plainOptions) {
      setCheckedList(plainOptions);
    }
  }, [plainOptions]);

  useEffect(() => {
    let allCategoriesCopy: Categories = {};

    // return each node where where checked item is present
    data?.sources?.nodes?.forEach((src: any) => {
      let includes: any = checkedList.includes(src.sourceDbName);
      if (includes) {
        let cats: any = src?.categoriesInSource;
        cats?.forEach((cat: any) => {
          if (typeof allCategoriesCopy[cat.name] === 'number') {
            allCategoriesCopy[cat.name] += cat.geneCount;
          } else {
            allCategoriesCopy[cat.name] = cat.geneCount;
          }
        });
      }
    });

    let categoriesArray = [];

    for (const key in allCategoriesCopy) {
      categoriesArray.push({ name: key, geneCount: allCategoriesCopy[key] });
    }

    categoriesArray.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    setRenderedCategories(categoriesArray);
  }, [checkedList]);

  const onChange = (event: any) => {
    if (checkedList.includes(event.target.id)) {
      const newList = checkedList.filter((selectedOption: any) => {
        return selectedOption !== (event.target.id as string);
      });
      setCheckedList(newList);
    } else {
      setCheckedList([...checkedList, event.target.id]);
    }
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const sourceNames = plainOptions.length === checkedList.length
  ? []
  : checkedList;

  return (
    <Box className="browse-cats-container">
      <Grid
        container
        justifyContent="space-between"
        className="browse-cats-title-container"
      >
        <Typography variant="h4" className="browse-cats-title">
          Druggable Gene Categories
        </Typography>
        <TableDownloader tableName="browse_category_results" vars={{ names: sourceNames }} />
      </Grid>
      <Grid container>
        <Box className="browse-cats-checkbox-container">
          <FormControlLabel
            label="Select/Deselect All"
            control={
              <Checkbox
                checked={checkAll}
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
              />
            }
          />
          {plainOptions.map((option) => {
            return (
              <Box>
                <FormControlLabel
                  label={option}
                  control={
                    <Checkbox
                      checked={checkedList.includes(option)}
                      onChange={onChange}
                      id={option}
                    />
                  }
                />
              </Box>
            );
          })}
        </Box>
        <Box className="browse-cats-accordion-horizontal-container" flex={1}>
          <Box style={{ maxHeight: '80vh', overflow: 'auto' }} boxShadow={3}>
            {renderedCategories?.map((cat: any, index: number) => {
              if (cat.geneCount) {
                return (
                  <Accordion
                    TransitionProps={{ unmountOnExit: true }}
                    disableGutters
                  >
                    <AccordionSummary
                      style={{ padding: '0 10px' }}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      {`${cat.name} (${cat.geneCount} genes)`}
                    </AccordionSummary>
                    <AccordionDetails
                      style={{ overflow: 'scroll', padding: '0 10px 10px' }}
                    >
                      <BrowseCategoriesGenesTable
                        categoryName={cat.name}
                        sourceDbNames={sourceNames}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              } else {
                return null;
              }
            })}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};
