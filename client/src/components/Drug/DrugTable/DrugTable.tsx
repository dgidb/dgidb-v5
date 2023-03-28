// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByDrugs } from 'hooks/queries/useGetInteractions';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './DrugTable.scss';
import { Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Box, CircularProgress, Icon } from '@mui/material';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';

interface Props {
  searchTerms: string[];
  displayHeader?: boolean;
}

export const DrugTable: React.FC<Props> = ({searchTerms, displayHeader}) => {
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  const { data, isLoading } = useGetInteractionsByDrugs(searchTerms);

  let drugs = data?.drugs?.nodes;

  //filter options
  const [drug, setDrug] = useState<any>([]);
  const [gene, setGene] = useState<any>([]);
  const [intScore, setIntScore] = useState<any>([]);
  const [queryScore, setQueryScore] = useState<any>([]);
  const [approvalStatus, setApprovalStatus] = useState<any>([]);

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
    let duplicateApprovalStatus = interactionResults?.map((item: any) => {
      return item?.drug?.approved;
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
    setApprovalStatus(duplicateApprovalStatus.filter(onlyUnique))
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
    approvalStatus = 3,
    intScore = 4,
    queryScore = 5,
  }

  const columnFilter = (unfilteredData: any, column: ColumnType) => {
    let duplicates = unfilteredData?.map((item: any) => {
      switch (column) {
        case 1:
          return item?.drug?.name;
        case 2:
          return item?.gene?.name;
        case 3:
          return item?.drug?.approved
        case 4:
          return item?.interactionScore;
        case 5:
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
          case "drug.approved":
            setApprovalStatus(columnFilter(extra.currentDataSource, 3));
            break;
          case "interactionScore":
            setIntScore(columnFilter(extra.currentDataSource, 4));
            break;
          case "queryScore":
            setQueryScore(columnFilter(extra.currentDataSource, 5));
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
        <a href={`/drugs/${record?.drug?.name}`}>{record?.drug?.name}</a>
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
        <a href={`/genes/${record?.gene?.name}`}>{record?.gene?.name}</a>
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
      title: 'Regulatory Approval',
      dataIndex: ['drug', 'approved'],
      render: (text: any, record: any) => (
        <span>{record?.drug?.approved ? 'Approved' : 'Not Approved'}</span>
      ),
      filters: approvalStatus.map((el: any) => {
        return {
          text: el ? "Approved" : "Not Approved",
          value: el,
        }
      }),
      onFilter: (value: any, record: any) => record?.drug.approved === value,
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

  return !isLoading ? (
    <div className="interaction-table-container">
      { displayHeader &&
        <span>
          <h3>Interaction Results</h3>
          {interactionResults ? <span id="interaction-count">{interactionResults.length} total interactions</span> : null}
        </span>
      }
      <TableDownloader tableName='drug_interaction_results' vars={{names: searchTerms}}/>
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
  ) :
  <Box display='flex' mt='10px' alignItems='center'><h3>Loading interaction results...</h3>
    <Icon component={CircularProgress} baseClassName='loading-spinner' fontSize='small'></Icon>
  </Box>
};
