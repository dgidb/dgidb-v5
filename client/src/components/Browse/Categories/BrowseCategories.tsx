// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';
import { useGetDruggableSources } from 'hooks/queries/useGetDruggableSources';
import { useGetCategoriesBySource } from 'hooks/queries/useGetCategories';
import { Collapse } from 'antd';

// components
import { GeneListTable } from 'components/Browse/Categories/GeneListTable';

// styles
import './BrowseCategories.scss';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;
const { Panel } = Collapse;

  interface Categories {
    [key: string]: number
  }

export const BrowseCategories: React.FC = () => {
  const [plainOptions, setPlainOptions] = useState([]);

  const [checkedList, setCheckedList] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [allCategories, setAllCategories] = useState<any>([])
  const [renderedCategories, setRenderedCategories] = useState<any>([])


  const { data } = useGetDruggableSources("POTENTIALLY_DRUGGABLE")

    useEffect(() => {
      if (data?.sources?.nodes){
        let nodes = data?.sources?.nodes
        let sources: any = [];

        nodes.forEach((node: any) => {
          sources.push(node.sourceDbName)
        })

        setPlainOptions(sources);

        let allCategoriesObj: Categories = {}

        nodes.forEach((node: any) => {
          node.categoriesInSource.forEach((cat: any) => {
            let key = cat.name
            allCategoriesObj[key] = 0;
          })
        })

        setAllCategories(allCategoriesObj);
      }
    }, [data])

    useEffect(() => {
      if (plainOptions) {
        setCheckedList(plainOptions);
      }
    }, [plainOptions])

    useEffect(() => {
      let allCategoriesCopy: Categories = {};

      // return each node where where checked item is present
      data?.sources?.nodes?.forEach((src: any) => {
        let includes: any = checkedList.includes(src.sourceDbName)
        if (includes) {
          let cats: any = src?.categoriesInSource;
          cats?.forEach((cat: any) => {
            if(typeof allCategoriesCopy[cat.name] === 'number') {
              allCategoriesCopy[cat.name] += cat.geneCount
            } else {
              allCategoriesCopy[cat.name] = cat.geneCount
            }
          })
        }
      })

      let categoriesArray = [];

      for (const key in allCategoriesCopy) {
        categoriesArray.push({name: key, geneCount: allCategoriesCopy[key]})
      }

      setRenderedCategories(categoriesArray);
    }, [checkedList])

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
         <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            Select/Deselect All
          </Checkbox>
        </div>

        <div className="category-list">
           <Collapse>
          {renderedCategories?.map((cat: any, index: number) => {
            if(cat.geneCount) {
              return (
                <Panel header={`${cat.name} ${cat.geneCount}`} key={index}>
                  <GeneListTable />
               </Panel>
              )
            } else {
              return null
            }
          })}
          </Collapse>

        </div>
      </div>
    )
}
