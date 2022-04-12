type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      }
};

export enum ActionTypes {
  AddTerm = "ADD_TERM",
  DeleteTerm = "DELETE_TERMS",
  DeleteAllTerms = "DELETE_ALL_TERMS",
  HideDisclaimer = "HIDE_DISCLAIMER",
  ShowDisclaimer = "SHOW_DISCLAIMER",
  EnableDarkMode = "ENABLE_DARK_MODE",
  DisableDarkMode = "DISABLE_DARK_MODE",
}

// search terms

type SearchTermsPayload = {
  [ActionTypes.AddTerm]: string;
  [ActionTypes.DeleteTerm]: undefined;
  [ActionTypes.DeleteAllTerms]: undefined;
};

export type SearchTermsActions = ActionMap<
  SearchTermsPayload
>[keyof ActionMap<SearchTermsPayload>];


export const searchTermsReducer = (
  state: string[],
  action: SearchTermsActions | ThemeSettingsActions
) => {
  let stateCopy = Array.from(state);
  switch (action.type) {
    case ActionTypes.AddTerm:
      return [...stateCopy, action.payload]
    case ActionTypes.DeleteTerm:
      return stateCopy.slice(0, -1);
    case ActionTypes.DeleteAllTerms:
      return [];
    default:
      return state;
  }
};


// theme settings

export interface themeSettingsType {
  showDisclaimer: boolean;
  darkModeEnabled: boolean;
}

type ThemeSettingsPayload = {
  [ActionTypes.HideDisclaimer]: undefined,
  [ActionTypes.ShowDisclaimer]: undefined,
  [ActionTypes.EnableDarkMode]: undefined,
  [ActionTypes.DisableDarkMode]: undefined
}

export type ThemeSettingsActions = ActionMap<
  ThemeSettingsPayload
>[keyof ActionMap<ThemeSettingsPayload>];


export const themeSettingsReducer = (
  state: themeSettingsType,
  action: SearchTermsActions | ThemeSettingsActions
) => {
  let stateCopy = Object.assign({}, state)
  switch (action.type) {
    case ActionTypes.HideDisclaimer:
      return {...stateCopy, showDisclaimer: false};
    case ActionTypes.ShowDisclaimer:
      return {...stateCopy, showDisclaimer: true};
    case ActionTypes.EnableDarkMode:
      return {...stateCopy, darkModeEnabled: true};
    case ActionTypes.DisableDarkMode:
      return {...stateCopy, darkModeEnabled: false};
    default:
      return state;
  }
};
