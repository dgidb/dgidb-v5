// hooks/dependencies
import React, { useState, useEffect } from "react";
import { useGetDruggableSources } from "hooks/queries/useGetDruggableSources";

// components
import { BrowseCategoriesGenesTable } from "components/Browse/Categories/BrowseCategoriesGenesTable";

// styles
import "./BrowseCategories.scss";
import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, FormControlLabel } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Categories {
  [key: string]: number;
}

export const BrowseCategories: React.FC = () => {
  const [plainOptions, setPlainOptions] = useState([]);

  const [checkedList, setCheckedList] = useState<any>([]);

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [renderedCategories, setRenderedCategories] = useState<any>([]);

  const { data } = useGetDruggableSources("POTENTIALLY_DRUGGABLE");

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
          if (typeof allCategoriesCopy[cat.name] === "number") {
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
      const newList = checkedList.filter((selectedOption: any) => { return selectedOption !== event.target.id as string })
      setCheckedList(newList)
    } else {
      setCheckedList([...checkedList, event.target.id])
    }
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div className="browse-categories-container">
      <div className="source-checklist">
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
      {plainOptions.map(option => {
        return <Box><FormControlLabel
        label={option}
        control={<Checkbox checked={checkedList.includes(option)} onChange={onChange} id={option} />}
      /></Box>})}
      </div>

      <div className="category-list">
          {renderedCategories?.map((cat: any, index: number) => {
            if (cat.geneCount) {
              return (
                <Accordion>
                  <AccordionSummary
                    style={{padding: "0 10px"}}
                    expandIcon={<ExpandMoreIcon />}
                >
                  {`${cat.name} ${cat.geneCount}`}
                </AccordionSummary>
                <AccordionDetails style={{overflow: "scroll", padding: "0 10px 10px"}}>
                <BrowseCategoriesGenesTable
                    categoryName={cat.name}
                    sourceDbNames={
                      plainOptions.length === checkedList.length
                        ? []
                        : checkedList
                    }
                  />
                </AccordionDetails>
              </Accordion>
              );
            } else {
              return null;
            }
          })}
      </div>
    </div>
  );
};
