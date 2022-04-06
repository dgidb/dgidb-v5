import React, { createContext, useReducer, Dispatch } from "react";
import {
  searchTermsReducer,
  SearchTermsActions,
  themeSettingsType,
  themeSettingsReducer,
  ThemeSettingsActions
} from "./reducers";

type InitialStateType = {
  searchTerms: string[];
  themeSettings: themeSettingsType;
};

const initialState = {
  searchTerms: [],
  themeSettings: {
    showDisclaimer: true
  }
}

const GlobalClientContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<SearchTermsActions | ThemeSettingsActions>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = (
  { searchTerms, themeSettings }: InitialStateType,
  action: SearchTermsActions | ThemeSettingsActions
) => ({
  searchTerms: searchTermsReducer(searchTerms, action),
  themeSettings: themeSettingsReducer(themeSettings, action),
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
