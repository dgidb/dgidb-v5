// hooks/dependencies
import React, { useContext } from 'react';
import { useGetCategories } from 'hooks/queries/useGetCategories';

// components
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './CategoryResults.scss';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';
import { Tab, Tabs } from '@mui/material';
import TabPanel from 'components/Shared/TabPanel/TabPanel';
import { useSearchParams } from 'react-router-dom';
import AmbiguousTermsSummary from 'components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary';

export const CategoryResults: React.FC = () => {
  const { state } = useContext(GlobalClientContext);
  const [searchParams] = useSearchParams();
  const searchType = searchParams.get('searchType');
  const { data } = useGetCategories(state.searchTerms);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const genes = data?.genes?.nodes;

  return (
    <div className="category-results-container">
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Unique Matches" />
        {/* TODO: fix/implement ambiguous matches for categories <Tab label="Ambiguous or Unmatched" /> */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <TableDownloader
          tableName="gene_category_results"
          vars={{ names: state.searchTerms }}
        />
        <div className="gene-categories">
          {genes?.map((gene: any) => {
            return (
              <div className="gene-category-result">
                <div className="gene-header">Search Term(s): "{gene.name}"</div>
                <div className="category-info">
                  <div className="category-item">
                    <div className="category-name table-header">Category</div>
                    <div className="sources-by-category table-header">
                      Sources
                    </div>
                  </div>
                  {gene.geneCategoriesWithSources.map((cat: any) => {
                    return (
                      <div className="category-item">
                        <div className="category-name">{cat.name}</div>
                        <div className="sources-by-category">
                          {cat.sourceNames.map(
                            (srcname: any, index: number) => {
                              if (index === cat.sourceNames.length - 1) {
                                return <span>{srcname}</span>;
                              }
                              return <span>{srcname}, </span>;
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </TabPanel>
      {/* TODO: implement/fix ambiguous terms for categories <TabPanel value={value} index={1}>
            <AmbiguousTermsSummary resultType={searchType || 'drug'} />
          </TabPanel> */}
    </div>
  );
};
