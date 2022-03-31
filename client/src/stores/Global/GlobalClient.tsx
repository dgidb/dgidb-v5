import React, { createContext, useReducer, Dispatch } from "react";
import {
  searchTermsReducer,
  SearchTermsActions,
} from "./reducers";


type InitialStateType = {
  searchTerms: string[]
};

const initialState = {
  searchTerms: [],
}

const GlobalClientContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<SearchTermsActions>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = (
  { searchTerms }: InitialStateType,
  action: SearchTermsActions 
) => ({
  searchTerms: searchTermsReducer(searchTerms, action)
});

const GlobalClient: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <GlobalClientContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalClientContext.Provider>
  );
};

export { GlobalClient, GlobalClientContext };
