// hooks/dependencies
import React, { useState, useEffect } from "react";
import { useGetDruggableSources } from "hooks/queries/useGetDruggableSources";
import { Collapse } from "antd";

// components
import { BrowseCategoriesGenesTable } from "components/Browse/Categories/BrowseCategoriesGenesTable";

// styles
import "./BrowseCategories.scss";
import { Checkbox } from "antd";

const CheckboxGroup = Checkbox.Group;
const { Panel } = Collapse;

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

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <div className="browse-categories-container">
      <div className="source-checklist">
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
        />
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Select/Deselect All
        </Checkbox>
      </div>

      <div className="category-list">
        <Collapse accordion>
          {renderedCategories?.map((cat: any, index: number) => {
            if (cat.geneCount) {
              return (
                <Panel header={`${cat.name} ${cat.geneCount}`} key={index}>
                  <BrowseCategoriesGenesTable
                    categoryName={cat.name}
                    sourceDbNames={
                      plainOptions.length === checkedList.length
                        ? []
                        : checkedList
                    }
                  />
                </Panel>
              );
            } else {
              return null;
            }
          })}
        </Collapse>
      </div>
    </div>
  );
};
