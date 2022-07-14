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
  const {data: interactionData } = useGetDruggableSources("POTENTIALLY_DRUGGABLE");
  const {data: potentiallyDruggableData } = useGetInteractionSources("INTERACTION");

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
      {
        geneSources?.map((src: any) => {
          return (
            <div>
              <div>source name: {src.sourceDbName}</div>
              <div>gene claims count: {src.geneClaimsCount}</div>
              <div>gene claims in group: {src.geneClaimsInGroup}</div>
            </div>
          )
        })
      }
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
      <div><b>Potentially Druggale</b></div>
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
      <div className="source-item">
        <div className="source-title">
        </div>
        
      </div>
    </div>
  )
}