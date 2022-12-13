// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useNavigate } from 'react-router-dom';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './GeneIntTable.scss';
import { Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const GeneIntTable: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  //filter options
  const [gene, setGene] = useState<any>([]);
  const [drug, setDrug] = useState<any>([]);
  const [approvalStatus, setApprovalStatus] = useState<any>([]);
  const [indication, setIndication] = useState<any>([]);
  const [intScore, setIntScore] = useState<any>([]);
  const [queryScore, setQueryScore] = useState<any>([]);

  const navigate = useNavigate();

  const { data, isError, isLoading } = useGetInteractionsByGenes(state.searchTerms);
  
  let genes = data?.genes;

  useEffect(() => {
    let interactionData: any = [];
    genes?.forEach((gene: any) => {
      gene.interactions.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setInteractionResults(interactionData)
  }, [genes])

  const navToRecord = (gene: string) => {
    navigate(`/genes/${gene}`);
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Gene',
      dataIndex: ['gene', 'name'],
      render: (text: any, record: any) => (
        <a onClick={() => navToRecord(record?.gene?.name)}>{record?.gene?.name}</a>
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
      title: 'Approval Status',
      dataIndex: ['drug', 'approved'],
      render: (text: any, record: any) => (
        <span>{record?.drug?.approved ? 'Approved' : 'Not Approved'}</span>
      ),
      filters: approvalStatus.map((el: any) => {
        return {
          text: el,
          value: el,
        }
      }),
      onFilter: (value: any, record: any) => record?.drug.approved.startsWith(value),
    },
    {
      title: 'Indication',
      dataIndex: ['drug', 'drugAttributes'],
      render: (text: any, record: any) => {
        let drugAttributes = record?.drug?.drugAttributes;

        let indicationAttributes = drugAttributes.filter((attribute: any) => {
          return attribute.name === 'Drug Indications'
        })

        return indicationAttributes.map((attribute: any) => {
          return <span>{attribute.value}</span>
        })

      },
      filters: indication.map((el: any) => {
        return {
          text: el,
          value: el,
        }
      }),
      //TODO: fix this
      onFilter: (value: any, record: any) => record?.drug.drugAttributes.startsWith(value),

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

  const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  }

  useEffect(() => {
    if (interactionResults){
      clearFilters();
    }
  }, [interactionResults]);

  const clearFilters = () => {
    let duplicateGene = interactionResults?.map((item: any) => {
      return item?.gene?.name;
    })
    let duplicateDrug = interactionResults?.map((item: any) => {
      return item?.drug?.name;
    })
    let duplicateApprovalStatus = interactionResults?.map((item: any) => {
      return item?.drug?.approved;
    })
    let duplicateIndication = interactionResults?.map((item: any) => {
      // TODO: this is an array of Drug Class + Drug Indications, find each Drug Indication
      return item?.drug?.drugAttributes[0]?.name;
    })
    let duplicateIntScore = interactionResults?.map((item: any) => {
      //TODO: make this a range
      return item?.interactionScore;
    })
    let duplicateQueryScore = interactionResults?.map((item: any) => {
      //TODO: make this query score
      return item?.interactionScore;
    })

    // setting state to unique instances of object values
    setGene(duplicateGene.filter(onlyUnique))
    setDrug(duplicateDrug.filter(onlyUnique))
    setApprovalStatus(duplicateApprovalStatus.filter(onlyUnique))
    setIndication(duplicateIndication.filter(onlyUnique))
    setIntScore(duplicateIntScore.filter(onlyUnique))
    setQueryScore(duplicateQueryScore.filter(onlyUnique))
  }

  enum ColumnType {
    gene = 1,
    drug = 2,
    approvalStatus = 3,
    indication = 4,
    intScore = 5,
    queryScore = 6
  }

  const columnFilter = (unfilteredData: any, column: ColumnType) => {
    let duplicates = unfilteredData?.map((item: any) => {
      switch (column) {
        case 1:
          return item?.gene?.name;
        case 2:
          return item?.drug?.name;
        case 3:
          return item?.drug?.approved;
        case 4:
          return item?.drug?.drugAttributes[0]?.name;
        case 5:
          return item?.interactionScore;
        case 6:
          return item?.interactionScore;
        default:
          return null;
      }
    })
    return duplicates.filter(onlyUnique);
  }

  function onFilterChange(pagination: any, filters: any, sorter: any, extra: any) {
    for (let prop in filters){
      // narrow filter options ONLY for columns which have no filtering
      // this prevents the filtered column from narrowing its own options + not being able to reset
      if (!filters[prop]){
        switch (prop) {
          case "gene.name":
            setGene(columnFilter(extra.currentDataSource, 1));
            break;
          case "drug.name":
            setDrug(columnFilter(extra.currentDataSource, 2));
            break;
          case "drug.approved":
            setApprovalStatus(columnFilter(extra.currentDataSource, 3));
            break;
            //TODO: fix this case
          case "drug.drugAttributes[0].name;":
            setIndication(columnFilter(extra.currentDataSource, 4));
            break;
          case "interactionScore":
            setIntScore(columnFilter(extra.currentDataSource, 5));
            break;
          case "queryScore":
            setQueryScore(columnFilter(extra.currentDataSource, 6));
            break;
          default:
            break;
        }
      }
    }
  }

  // if (isError || isLoading) {
  //   return (
  //     <div className="interaction-table--container">
  //       {isError && <div>Error: Interactions not found!</div>}
  //       {isLoading && <div>Loading...</div>}
  //     </div>
  //   )
  // }

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
