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
      <div className="source-type-header"><h2><b>Gene Sources</b></h2></div>
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
      <div className="source-type-header"><h2><b>Drug Sources</b></h2></div>
      <div className="sources-grid">
        {
          drugSources?.map((src: any) => {
            return (
              <div className="gene-source-item">
                <div className="source-item-name">{src.sourceDbName}</div>
                <div className="source-item-count">Total: {src.drugClaimsCount}</div>
                <div className="source-item-in-group">In Group: {src.drugClaimsInGroupsCount}</div>
                <div className="source-item-links">
                  <div className="source-item-license"><a>License</a></div>
                  <div className="source-item-citation"><a>Full Citation</a></div>
                </div>
              </div>
            )
          })
        }
      </div>

      <div className="source-type-header"><h2><b>Interaction Sources</b></h2></div>
      <div className="sources-grid">
        {
          interactionSources?.map((src: any) => {
            return (
              <div className="gene-source-item">
                <div className="source-item-name">{src.sourceDbName}</div>
                <div className="source-item-count">gene claims count: {src.drugClaimsCount}</div>
                <div className="source-item-in-group">gene claims in group: {src.drugClaimsInGroupsCount}</div>
                <div className="source-item-links">
                  <div className="source-item-license"><a>License</a></div>
                  <div className="source-item-citation"><a>Full Citation</a></div>
                </div>
              </div>
            )
          })
        }
      </div>

      <div className="source-type-header"><h2><b>Potentially Druggable</b></h2></div>
      <div className="sources-grid">
        {
          interactionSources?.map((src: any) => {
            return (
              <div className="gene-source-item">
                <div className="source-item-name">{src.sourceDbName}</div>
                <div className="source-item-count">gene claims count: {src.drugClaimsCount}</div>
                <div className="source-item-in-group">gene claims in group: {src.drugClaimsInGroupsCount}</div>
                <div className="source-item-count">gene claims count: {src.geneClaimsCount}</div>
                <div className="source-item-in-group">gene claims in group: {src.geneClaimsInGroupsCount}</div>
                <div className="source-item-links">
                  <div className="source-item-license"><a>License</a></div>
                  <div className="source-item-citation"><a>Full Citation</a></div>
                </div>
              </div>
            )
          })
        }
      </div>

      <div className="source-item">
        <div className="source-title">
        </div>
      </div>
    </div>
  )
}