import React, { createContext, useReducer, Dispatch } from "react";
import {
  searchTermsReducer,
  SearchTermsActions,
  themeSettingsType,
  themeSettingsReducer,
  ThemeSettingsActions,
  interactionModeReducer,
  InteractionModeActions,
} from "./reducers";
import { SearchTypes } from "types/types";

type InitialStateType = {
  interactionMode: SearchTypes;
  searchTerms: string[];
  themeSettings: themeSettingsType;
};

const initialState: InitialStateType = {
  interactionMode: SearchTypes.Gene,
  searchTerms: [],
  themeSettings: {
    showDisclaimer: false,
    darkModeEnabled: false,
    brandTheme: false
  }
}

const GlobalClientContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<InteractionModeActions | SearchTermsActions | ThemeSettingsActions>;
}>({
  state: initialState,
  dispatch: () => null
});

const mainReducer = (
  { searchTerms, themeSettings, interactionMode }: InitialStateType,
  action: InteractionModeActions | SearchTermsActions | ThemeSettingsActions
) => ({
  searchTerms: searchTermsReducer(searchTerms, action),
  themeSettings: themeSettingsReducer(themeSettings, action),
  interactionMode: interactionModeReducer(interactionMode, action)
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
