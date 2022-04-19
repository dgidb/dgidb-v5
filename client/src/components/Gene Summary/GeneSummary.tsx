// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByGenes } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './GeneSummary.scss';

const InteractionCount: React.FC = () => {
  const {state} = useContext(GlobalClientContext);
  const [interactionResultsy, setInteractionResultsy] = useState<any[]>([]);
  const { data, isError, isLoading } = useGetInteractionsByGenes(state.searchTerms);
  
  let genes = data?.genes;

  return (
    <div className="interaction-count-container">
      <h4>Gene Interactions</h4>
      <div className="interaction-count-row">
        <div className="interaction-count-gene"><b>Gene</b></div>
        <div className="interaction-count"><b>Interactions</b></div>
      </div>
      {genes.map((gene: any) => {
        return (
          <div className="interaction-count-row">
            <div className="interaction-count-gene">{gene.name}</div>
            <div className="interaction-count">{gene.interactions.length}</div>
          </div>
          )
      })}
    </div>
  )
}
const SummaryInfo: React.FC = () => {
  return (
    <div className="summary-infographic-container">
      <h4>Summary Infographics</h4>
    </div>
  )
}

export const GeneSummary: React.FC = () => {

  const {state} = useContext(GlobalClientContext);
  const { data, error, isError, isLoading, refetch} = useGetInteractionsByGenes(state.searchTerms);

  if (isError || isLoading) {
    return (
      <div className="gene-summary-container">
        {isError && <div>Error: Interactions not found!</div>}
        {isLoading && <div>Loading...</div>}
      </div>
    )
  }
  return (
    <div className="gene-summary-container">
      <h3>Gene Summary</h3>
      <div className="gene-summary-content">
        <InteractionCount/>
        <SummaryInfo />
      </div>
    </div>
  )
};
