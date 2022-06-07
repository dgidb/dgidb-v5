// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetInteractionsByGenes} from 'hooks/queries/useGetInteractions';
import { useGetGeneRecord } from 'hooks/queries/useGetGeneRecord';
import { useGetDruggableSources } from 'hooks/queries/useGetDruggableSources';
import { useGetCategoriesBySource } from 'hooks/queries/useGetCategories';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './BrowseCategories.scss';
import { Checkbox } from 'antd';

export const BrowseCategories: React.FC = () => {
  let [sources, setSources] = useState<any>([])
  let [options, setOptions] = useState<any>([])
  let [selectedSources, setSelectedSources] = useState<any>([])
  let [categories, setCategories] = useState<any>([])
  let [allCategories, setAllCategories] = useState<any>([])

  const { data } = useGetDruggableSources("POTENTIALLY_DRUGGABLE")

  interface Categories {
    [key: string]: number
  }

  useEffect(() => {
    console.log(data?.sources?.nodes)
    if (data?.sources?.nodes){
      let nodes = data?.sources?.nodes
      setSources(nodes)

      let sourceNames = nodes.map((node: any) => node.sourceDbName)
      setOptions(sourceNames);

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

  const onChange = (selectedSourceNames: any) => {
    let selectedSourcesArray = selectedSourceNames.map((srcName: any) => {
      return sources.find((src: any) => {
        return src.sourceDbName === srcName;
      })
    })
    setSelectedSources(selectedSourcesArray)
  }

  useEffect(() => {

    let allCategoriesCopy: Categories = {};

    selectedSources.forEach((src: any) => {
      let cats = src.categoriesInSource;
      cats.forEach((cat: any) => {
        if(typeof allCategoriesCopy[cat.name] === 'number') {
          allCategoriesCopy[cat.name] += cat.geneCount
        } else {
          allCategoriesCopy[cat.name] = cat.geneCount
        }
      })
    })

    let categoriesArray = [];

    for (const key in allCategoriesCopy) {
      categoriesArray.push({name: key, geneCount: allCategoriesCopy[key]})
    }

    setCategories(categoriesArray);

  }, [selectedSources])

  return (
    <div className="browse-categories-container">
      <div className="source-checklist">
        <Checkbox.Group options={options} onChange={onChange} />
        <div><Checkbox defaultChecked> Select/Deselect All</Checkbox></div>

      </div>

      <div className="category-list">
        {categories?.map((cat: any) => {
          if(cat.geneCount) {
            return <div>{cat.name}: {cat.geneCount}</div>
          } else {
            return null
          }
        })}

      </div>
    </div>
  )
};
