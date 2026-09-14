import React, { createContext, useEffect, useReducer, Dispatch } from 'react';
import {
  searchTermsReducer,
  SearchTermsActions,
  themeSettingsType,
  ThemeMode,
  themeSettingsReducer,
  ThemeSettingsActions,
  interactionModeReducer,
  InteractionModeActions,
} from './reducers';
import { SearchTypes } from 'types/types';

type InitialStateType = {
  interactionMode: SearchTypes;
  searchTerms: string[];
  themeSettings: themeSettingsType;
};

export const THEME_STORAGE_KEY = 'dgidb-theme';

const getInitialThemeMode = (): ThemeMode => {
  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedMode === 'dark' ? 'dark' : 'light';
};

const createInitialState = (): InitialStateType => ({
  interactionMode: SearchTypes.Gene,
  searchTerms: [],
  themeSettings: {
    mode: getInitialThemeMode(),
  },
});

const initialState = createInitialState();

const GlobalClientContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<
    InteractionModeActions | SearchTermsActions | ThemeSettingsActions
  >;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  { searchTerms, themeSettings, interactionMode }: InitialStateType,
  action: InteractionModeActions | SearchTermsActions | ThemeSettingsActions
) => ({
  searchTerms: searchTermsReducer(searchTerms, action),
  themeSettings: themeSettingsReducer(themeSettings, action),
  interactionMode: interactionModeReducer(interactionMode, action),
});

const GlobalClient: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, undefined, createInitialState);

  useEffect(() => {
    document.documentElement.dataset.theme = state.themeSettings.mode;
    window.localStorage.setItem(THEME_STORAGE_KEY, state.themeSettings.mode);
  }, [state.themeSettings.mode]);

  return (
    <GlobalClientContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalClientContext.Provider>
  );
};

export { GlobalClient, GlobalClientContext };
