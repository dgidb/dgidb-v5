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
  ShowDisclaimer = "SHOW_DISCLAIMER"
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

export type themeSettingsType = {
  showDisclaimer: boolean
}

type ThemeSettingsPayload = {
  [ActionTypes.HideDisclaimer]: undefined;
  [ActionTypes.ShowDisclaimer]: undefined;
}

export type ThemeSettingsActions = ActionMap<
  ThemeSettingsPayload
>[keyof ActionMap<ThemeSettingsPayload>];


export const themeSettingsReducer = (
  state: themeSettingsType,
  action: SearchTermsActions | ThemeSettingsActions
) => {
  switch (action.type) {
    case ActionTypes.HideDisclaimer:
      return {showDisclaimer: false};
    case ActionTypes.ShowDisclaimer:
      return {showDisclaimer: true};
    default:
      return state;
  }
};
