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

const GlobalContext = createContext<{
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

const GlobalProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
