import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { request, gql, GraphQLClient } from 'graphql-request';
import SearchBar from '../../components/searchbar/SearchBar.component';
import { useGetInteractions } from '../../hooks/interactions/useGetInteractions';

import { FilterOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';
import { Button, Select, Form, Popover, Card, Table, Tag } from 'antd';
import 'antd/dist/antd.css';

import './results.page.scss';

const graphQLClient = new GraphQLClient('http://127.0.0.1:3000/api/graphql');

function useInteractions(id: string) {
	return useQuery('interactions', async () => {
		const { interactions: { data } } = await graphQLClient.request(
			gql`
				query gene($id: String!) {
					gene(id: $id) {
						interactions {
							interactionClaims {
								drugClaim {
									drug {
										name
									}
								}
							}
						}
					}
				}
			`,
			{ id }
		);
		return data;
	});
}

export const Results: React.FC = () => {

	const { data, error, isLoading, isError, isFetching } = useGetInteractions('5c60a645-e13e-4236-8aaf-5879bd44993e');

  // const data = 
  //   {
  //     term: "FLT2",
  //     alias: "FGR1",
  //     interactions: [
  //       {
  //         drug: "FRUQINTINIB",
  //         type: "inhibitor (inhibitory)",
  //         directionality: "inhibitory",
  //         sources: ['TALC', 'MyCancerGenome', 'TdgClinicalTrial', 'JAX-CKB', 'GuideToPharmacology'],
  //         PMIDs: ['222e8366', '18559524', '31016670'],
  //         query_score: 5.98,
  //         interaction_score: 0.91
          
  //       },
  //       {
  //         drug: "TIVOZANIB",
  //         type: "inhibitor (inhibitory)",
  //         directionality: "inhibitory",
  //         sources: ['TALC', 'MyCancerGenome', 'ChemblInteractions'],
  //         PMIDs: ['222e8366', '18559524', '31016670'],
  //         query_score: 5.11,
  //         interaction_score: 0.72
          
  //       },
  //       {
  //         drug: "SUNITINIB",
  //         type: "inhibitor (inhibitory)",
  //         directionality: "inhibitory",
  //         sources: ['TALC', 'DTC', 'TdgClinnicalTrial', 'CGI', 'TEND'],
  //         PMIDs: ['222e8366', '18559524', '31016670'],
  //         query_score: 4.59,
  //         interaction_score: 0.38
          
  //       },
  //       {
  //         drug: "ICRUCUMAB",
  //         type: "antagonist (inhibitory)",
  //         directionality: "inhibitory",
  //         sources: ['TALC', 'MyCancerGenome', 'TdgClinicalTrial', 'JAX-CKB', 'GuideToPharmacology'],
  //         PMIDs: ['222e8366', '18559524', '31016670'],
  //         query_score: 4.38,
  //         interaction_score: 0.24
          
  //       },
  //       {
  //         drug: "CEP-5214",
  //         type: "inhibitor (inhibitory)",
  //         directionality: "inhibitory",
  //         sources: ['ChemblInteractions', 'TTD'],
  //         PMIDs: ['222e8366', '18559524', '31016670'],
  //         query_score: 3.84,
  //         interaction_score: 0.67
          
  //       },
  //       {
  //         drug: "VEGFRECINE",
  //         type: "n/a",
  //         directionality: "inhibitory",
  //         sources: ['MyCancerGenome', 'GuideToPharmacology', 'JAX-CKB'],
  //         PMIDs: ['222e8366', '18559524', '31016670'],
  //         query_score: 3.51,
  //         interaction_score: 0.3
          
  //       },

  //     ]
  //   }

    // const columns = [
    //   {
    //     title: 'Drug',
    //     dataIndex: 'drug',
    //     key: 'drug',
    //     render: (text: string) => <a href="#">{text}</a>
    //   },
    //   {
    //     title: 'Type',
    //     dataIndex: 'type',
    //     key: 'type',
    //   },
    //   {
    //     title: 'Sources',
    //     dataIndex: 'sources',
    //     key: 'sources',
    //     render: (sources: string[]) => (
    //       <>
    //         {sources.map((source: any) => {
    //           let color = 'geekblue';

    //           return (
    //             <Tag color={color} key={source}>
    //               {source.toUpperCase()}
    //             </Tag>
    //           );
    //         })}
    //       </>
    //     ),
    //     width: '45%',
    //   },
    //   {
    //     title: 'PMIDs',
    //     dataIndex: 'PMIDs',
    //     key: 'PMIDs',
    //     render: (PMIDs: string[]) => (
    //       <>
    //         {PMIDs.map((pmid: any) => {
    //           let color = 'geekblue';
    //           return (
    //             <Tag color={color} key={pmid}>
    //               {pmid.toUpperCase()}
    //             </Tag>
    //           );
    //         })}
    //       </>
    //     ),
    //   },
    //   {
    //     title: 'Query Score',
    //     dataIndex: 'query_score',
    //     key: 'query_score',
    //   },
    //   {
    //     title: 'Interaction Score',
    //     dataIndex: 'interaction_score',
    //     key: 'interaction_score',
    //   },
    // ];
  
    



	return (
    <>
    <div>data</div>
    <div>{JSON.stringify(data)}</div>
    {/* <div className="results-container">
     <h3>{`"${data.term}" > ${data.alias}`}</h3>
      <Table 
        dataSource={data.interactions} 
        columns={columns} 
        pagination={{hideOnSinglePage: true}}
      />

      <div className="results-buttons">
        <Button size="small">Show All</Button>
        <Button size="small">Show More</Button>
        <Button size="small">Show Less</Button>
        <span className="showing">Showing 10 out of 85 interactions</span>
      </div>


      
    </div> */}


    </>
  )
};
