// hooks/dependencies
import React, {useState, useEffect, useContext} from 'react';
import { useGetInteractionsByDrugs } from 'hooks/interactions/useGetInteractions';
import { GlobalClientContext } from 'stores/Global/GlobalClient';

// styles
import './DrugSummary.scss';

export const DrugSummary: React.FC = () => {

  const {state} = useContext(GlobalClientContext);

  const [drugData, setDrugData] = useState<any>([]);

  const { data, error, isError, isLoading} = useGetInteractionsByDrugs(state.searchTerms);

  let drugs = data?.drugs;

  useEffect(() => {
    setDrugData(drugs)
  }, [drugs])

  if (isError) {
    return <div className="drug-summary-container">Error: Interactions not found!</div>
  }

  if (isLoading) {
    return <div className="drug-summary-container">Loading</div>
  }

  return (
    <div className="drug-summary-container">
      <h3>Drug Summary</h3>
      <div className="drug-summary-content">
        {drugData?.map((drug: any) => {
          return (
            <div>
              <b>{drug?.name}</b>
              {drug?.interactions.map((int: any) => {
                return (
                  <div>{int?.gene?.name}</div>
                )
              })}             
            </div>
          )
        })}
      </div>
    </div>
  )
};
