// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useGetCategories} from 'hooks/queries/useGetCategories';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import { Tabs } from 'antd';
import './CategoryResults.scss';

export const CategoryResults: React.FC = () => {

  const { TabPane } = Tabs;

  const { state } = useContext(GlobalClientContext);
  const { data } = useGetCategories(state.searchTerms);

  const genes = data?.genes?.nodes

  const onChange = () => {

  }

  return (
    <div className="category-results-container">
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Unique Matches" key="1">
        <div className="gene-categories">
            {genes?.map((gene: any) => {
              return (
                <div className="gene-category-result">
                <div className="gene-header">Search Term(s): "{gene.name}"</div>
                <div className="category-info">
                <div className="category-item">
                  <div className="category-name table-header">Category</div>
                  <div className="sources-by-category table-header">Sources</div>
                </div>
                {gene.geneCategoriesWithSources.map((cat: any) => {
                  return (
                    <div className="category-item">
                      <div className="category-name">{cat.name}</div>
                      <div className="sources-by-category">{cat.sourceNames.map((srcname: any, index: number) => {
                        if(index === cat.sourceNames.length - 1) {
                          return <span>{srcname}</span>
                        }
                        return <span>{srcname}, </span>
                      })}</div>
                    </div>
                  )
                })}
                </div>
              </div>
                )
            })}
          </div>
        </TabPane>
        <TabPane tab="Ambiguous or Unmatched" key="2">
        </TabPane>
      </Tabs>

    </div>
  )
};
