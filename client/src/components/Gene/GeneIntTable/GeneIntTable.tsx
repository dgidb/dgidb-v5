// hooks/dependencies
import React, {useState, useEffect} from 'react';
import { useGetInteractionsByGenes } from 'hooks/queries/useGetInteractions';

// methods
import { truncateDecimals } from 'utils/format';

// styles
import './GeneIntTable.scss';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Box, CircularProgress, Icon } from '@mui/material';
import TableDownloader from 'components/Shared/TableDownloader/TableDownloader';


interface Props {
  searchTerms: string[];
  displayHeader?: boolean;
}

export const GeneIntTable: React.FC<Props> = ({searchTerms, displayHeader=true}) => {
  const [interactionResults, setInteractionResults] = useState<any[]>([]);

  //filter options
  const [gene, setGene] = useState<any>([]);
  const [drug, setDrug] = useState<any>([]);
  const [approvalStatus, setApprovalStatus] = useState<any>([]);
  const [indication, setIndication] = useState<any>([]);
  const [intScore, setIntScore] = useState<any>([]);

  const { data, isLoading } = useGetInteractionsByGenes(searchTerms)

  let genes = data?.genes?.nodes;

  useEffect(() => {
    let interactionData: any = [];
    genes?.forEach((gene: any) => {
      gene.interactions.forEach((int: any) => {
        interactionData.push(int)
      })
    })
    setInteractionResults(interactionData)
  }, [genes, searchTerms])

  const columns: ColumnsType<any> = [
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
      title: 'Regulatory Approval',
      dataIndex: ['drug', 'approved'],
      render: (text: any, record: any) => (
        <span>{record?.drug?.approved ? 'Approved' : 'Not Approved'}</span>
      ),
      filters: approvalStatus.map((el: any) => {
        return {
          text: el ? 'Approved' : 'Not Approved',
          value: el,
        }
      }),
      onFilter: (value: any, record: any) => record?.drug?.approved === value,
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
          case 'gene.name':
            setGene(columnFilter(extra.currentDataSource, 1));
            break;
          case 'drug.name':
            setDrug(columnFilter(extra.currentDataSource, 2));
            break;
          case 'drug.approved':
            setApprovalStatus(columnFilter(extra.currentDataSource, 3));
            break;
            //TODO: fix this case
          case 'drug.drugAttributes[0].name;':
            setIndication(columnFilter(extra.currentDataSource, 4));
            break;
          case 'interactionScore':
            setIntScore(columnFilter(extra.currentDataSource, 5));
            break;
          default:
            break;
        }
      }
    }
  }
  return !isLoading ?
    <Box className='interaction-table-container'>
      {
        displayHeader && 
        <span>
          <h3>Interaction Results</h3>
          <span id='interaction-count'>{interactionResults.length} total interactions</span>
        </span>
      }
      <TableDownloader tableName='gene_interaction_results' vars={{names: searchTerms}}/>
      <Table
          dataSource={interactionResults}
          columns={columns}
          onChange={onFilterChange}
          rowKey={(record, index) => `${index}`}
          pagination={{ pageSize: displayHeader ? 20 : 10}}
        />
    </Box>
  : 
  <Box display='flex' mt='10px' alignItems='center'><h3>Loading interaction results...</h3>
    <Icon component={CircularProgress} baseClassName='loading-spinner' fontSize='small'></Icon>
  </Box>
};
