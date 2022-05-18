// hooks/dependencies
import React, {useState, useContext, useEffect} from 'react';
import { useGetGeneRecord} from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';
import { useParams } from 'react-router-dom';

// styles
import './GeneRecord.scss';
import { Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const GeneRecord: React.FC = () => {

  const geneSymbol = 'FLT1'

  const { data, isError, isLoading } = useGetGeneRecord(geneSymbol!);

  return (
    <div className="gene-record-container">
      <div className="gene-record-header">{geneSymbol}</div>
      <div className="gene-record-info"></div>
      <div className="gene-record-aliases">
        {data?.gene?.geneAliases?.map((alias: any) => {
          return <div>{alias?.alias}</div>
        })}
      </div>
      <div className="gene-record-publications">
        {data?.gene?.geneClaims?.map((claim: any) => {
          return <div>{claim?.source?.citation}</div>
        })}
      </div>
      <div className="gene-record-categories">
        {data?.gene?.geneCategories?.map((category: any) => {
          return <div>{category?.name}</div>
        })}
      </div>
      <div className="gene-record-interactions">
        {data?.gene?.interactions.map((int: any) => {
          return <div>Drug: [{int?.drug?.name}], Type: [{int?.interactionTypes[0]?.type}]</div>
        })}
      </div>
    </div>
  )
};

export const GeneRecordContainer: React.FC = () => {
  return (
    <>
      <GeneRecord />
    </>
  )
};

