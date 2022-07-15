// hooks/dependencies
import React, { useState, useContext, useEffect} from 'react';
import {
  useGetDruggableSources,
  useGetGeneSources,
  useGetDrugSources,
  useGetInteractionSources,
} from 'hooks/queries/useGetDruggableSources';

// styles
import './BrowseSources.scss';

export const BrowseSources = () => {

  const {data: geneData } = useGetGeneSources("GENE");
  const {data: drugData } = useGetDrugSources("DRUG");
  const {data: interactionData } = useGetInteractionSources("INTERACTION");
  const {data: potentiallyDruggableData } = useGetDruggableSources("POTENTIALLY_DRUGGABLE");

  let geneSources = geneData?.sources?.nodes;
  let drugSources = drugData?.sources?.nodes;
  let interactionSources = interactionData?.sources?.nodes;
  let potentiallyDruggableSources = potentiallyDruggableData?.sources?.nodes;

  useEffect(() => {
    console.log('geneData', geneData)
  }, [geneData])

  useEffect(() => {
    console.log('drugData', drugData)
  }, [drugData])

  useEffect(() => {
    console.log('interactionData', interactionData)
  }, [interactionData])

  useEffect(() => {
    console.log('potentiallyDruggableData', potentiallyDruggableData)
  }, [potentiallyDruggableData])

  // gene section, drug section, interaction, potentially druggable

  return (
    <div className="sources-page-container">
      <div><b>Gene Sources</b></div>
      <div className="sources-grid">
        {
          geneSources?.map((src: any) => {
            return (
              <div className="gene-source-item">
                <div className="source-item-name">{src.sourceDbName}</div>
                <div className="source-item-count">Total: {src.geneClaimsCount}</div>
                <div className="source-item-in-group">In Group: {src.geneClaimsInGroupsCount}</div>
                <div className="source-item-links">
                  <div className="source-item-license"><a>License</a></div>
                  <div className="source-item-citation"><a>Full Citation</a></div>
                </div>
              </div>
            )
          })
        }
      </div>

      <div><b>Drug Sources</b></div>
      {
        drugSources?.map((src: any) => {
          return (
            <div>
              <div>source name: {src.sourceDbName}</div>
              <div>gene claims count: {src.drugClaimsCount}</div>
              <div>gene claims in group: {src.drugClaimsInGroupsCount}</div>
            </div>
          )
        })
      }
      <div><b>Interaction Sources</b></div>
      {
        interactionSources?.map((src: any) => {
          return (
            <div>
              <div>source name: {src.sourceDbName}</div>
              <div>gene claims count: {src.drugClaimsCount}</div>
              <div>gene claims in group: {src.drugClaimsInGroupsCount}</div>
            </div>
          )
        })
      }
      <div><b>Potentially Druggalbe</b></div>
      {
          potentiallyDruggableSources?.map((src: any) => {
          return (
            <div>
              <div>source name: {src.sourceDbName}</div>
              <div>drug claims count: {src.drugClaimsCount}</div>
              <div>drug claims in group: {src.drugClaimsInGroupsCount}</div>
              <div>gene claims count: {src.geneClaimsCount}</div>
              <div>gene claims in group: {src.geneClaimsInGroupsCount}</div>
            </div>
          )
        })
      }
      <div className="source-item">
        <div className="source-title">
        </div>
        
      </div>
    </div>
  )
}