// hooks/dependencies
import React, { useContext, useEffect, useState } from "react";
import { GlobalClientContext } from "stores/Global/GlobalClient";
import { useSearchParams } from "react-router-dom";

// components
import { GeneSummary } from "components/Gene/GeneSummary";
import { DrugSummary } from "components/Drug/DrugSummary";
import { CategoryResults } from "components/Gene/Categories/CategoryResults";
import { AmbiguousTermsSummary } from "components/Shared/AmbiguousTermsSummary/AmbiguousTermsSummary";
import { ActionTypes } from "stores/Global/reducers";

// styles
import "./Results.scss";
import { Tab, Tabs } from "@mui/material";
import TabPanel from "components/Shared/TabPanel/TabPanel";
import { GeneSearchResult } from "components/Gene/GeneSearchResult/GeneSearchResult";

export const Results: React.FC = () => {
  const { state, dispatch } = useContext(GlobalClientContext);
  const [searchParams] = useSearchParams();
  const searchTerms = searchParams.get("searchTerms")?.split(",");
  const searchType = searchParams.get("searchType");

  const [value, setValue] = React.useState(0);
  console.log(`value: ${value}`);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // update search type based on search params
    if (searchParams) {
      if (searchType === "gene") {
        dispatch({ type: ActionTypes.SetByGene });
      }
      if (searchType === "drug") {
        dispatch({ type: ActionTypes.SetByDrug });
      } else if (searchType === "categories") {
        dispatch({ type: ActionTypes.SetGeneCategories });
      }
    }
    // populate search terms based on search params if the params don't match what's in the state
    if (
      searchParams &&
      searchTerms?.toString() !== state?.searchTerms?.toString()
    ) {
      state.searchTerms = [];
      const terms = searchParams.get("searchTerms")?.split(",");
      terms?.forEach((term) =>
        dispatch({ type: ActionTypes.AddTerm, payload: term })
      );
    }
  }, []);

  return (
    <div className="results-page-container">
      {searchType !== "categories" ? (
        <>
          {searchType === "gene" ? (
            <GeneSearchResult value={value} handleChange={handleChange} />
          ) : (
            <></>
          )}
        </>
      ) : (
        ""
      )}
      {searchType === "categories" && <CategoryResults />}
    </div>
  );
};
