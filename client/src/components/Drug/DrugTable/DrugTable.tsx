// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByDrugs } from 'hooks/queries/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './DrugTable.scss';
import { Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

// TODO: Why is there a module exports error when removing this?
export const test2: React.FC = () => {
  return (
    <></>
  )
}
export const DrugTable: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const { data } = useGetInteractionsByDrugs(state.searchTerms);
  
  let drugs = data?.drugs;

  //filter options
  const [drug, setDrug] = useState<any>([]);
  const [gene, setGene] = useState<any>([]);
  const [intScore, setIntScore] = useState<any>([]);
  const [queryScore, setQueryScore] = useState<any>([]);

  const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  }

  const clearFilters = () => {
    let duplicateDrug = interactionResults?.map((item: any) => {
      return item?.drug.name;
    })
    let duplicateGene= interactionResults?.map((item: any) => {
      return item?.gene.name;
    })
    let duplicateIntScore = interactionResults?.map((item: any) => {
      return item?.interactionScore;
    })
    let duplicateQueryScore = interactionResults?.map((item: any) => {
      // TODO: fix this
      return item?.queryScore;
    })

    // setting state to unique instances of object values
    setDrug(duplicateDrug.filter(onlyUnique))
    setGene(duplicateGene.filter(onlyUnique))
    setIntScore(duplicateIntScore.filter(onlyUnique))
    setQueryScore(duplicateQueryScore.filter(onlyUnique))
  }

  useEffect(() => {
    if (interactionResults) {
      clearFilters();
    }
  }, [interactionResults])

  enum ColumnType {
    drug = 1,
    gene = 2,
    intScore = 3,
    queryScore = 4,
  }

  const columnFilter = (unfilteredData: any, column: ColumnType) => {
    let duplicates = unfilteredData?.map((item: any) => {
      switch (column) {
        case 1:
          return item?.drug?.name;
        case 2:
          return item?.gene?.name;
        case 3:
          return item?.interactionScore;
        case 4:
          return item?.queryScore;
        default:
          return null;
      }
    })
    return duplicates.filter(onlyUnique);
  }

  function onFilterChange(pagination: any, filters: any, sorter: any, extra: any) {
    for (let prop in filters) {
      // narrow filter options ONLY for columns which have no filtering
      // this prevents the filtered column from narrowing its own options + not being able to reset
      if (!filters[prop]) {
        switch (prop) {
          case "drug":
            setDrug(columnFilter(extra.currentDataSource, 1));
            break;
          case "gene":
            setGene(columnFilter(extra.currentDataSource, 2));
            break;
          case "interactionScore":
            setIntScore(columnFilter(extra.currentDataSource, 3));
            break;
          case "queryScore":
            setQueryScore(columnFilter(extra.currentDataSource, 4));
            break;
          default:
            break;
        }
      }
    }
  }



  useEffect(() => {
    let interactionData: any = [];
    drugs?.forEach((drug: any) => {
      drug.interactions?.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setInteractionResults(interactionData)
  }, [drugs])

  const columns: ColumnsType<any> = [
    {
      title: 'Drug',
      dataIndex: ['drug', 'name'],
      render: (text: any, record: any) => (
        <a onClick={() => navigate(`/drugs/${record?.drug?.name}`)}>{record?.drug?.name}</a>
      ),
      filters: drug.map((el: any) => {
        return {
          text: el,
          value: el,
        }
      }),
      onFilter: (value: any, record: any) => record?.drug.name.startsWith(value),
    },
    {
      title: 'Gene',
      dataIndex: ['gene', 'name'],
      render: (text: any, record: any) => (
        <a onClick={() => navigate(`/genes/${record?.gene?.name}`)}>{record?.gene?.name}</a>
      ),
      filters: gene.map((el: any) => {
        return {
          text: el,
          value: el,
        }
      }),
      onFilter: (value: any, record: any) => record?.gene.name.startsWith(value),
    },
    {
      title: 'Interaction Score',
      dataIndex: ['interactionScore'],
      render: (text: any, record: any) => (
        <span>{truncateDecimals(record?.interactionScore, 2)}</span>
      ),
      filters: intScore.map((el: any) => {
        return {
          text: el,
          value: el,
        }
      }),
      onFilter: (value: any, record: any) => record?.interactionScore.startsWith(value),

    },
    {
      title: 'Query Score',
      dataIndex: ['queryScore'],
      render: (text: any, record: any) => (
        <span></span>
      ),
      filters: queryScore.map((el: any) => {
        return {
          text: el,
          value: el,
        }
      }),
    },
  ]

  return (
    <div className="interaction-table-container">
      <span>
        <h3>Interaction Results</h3>
        {interactionResults ? <span id="interaction-count">{interactionResults.length} total interactions</span> : null}
      </span>
      <Skeleton loading={!interactionResults.length}>
        <Table 
          dataSource={interactionResults}
          columns={columns}
          onChange={onFilterChange}
          rowKey={(record, index) => `${index}`}
          pagination={{ pageSize: 20}}
        />
      </Skeleton>
    </div>
  )
};
