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
  DeleteTerm = "DELETE_TERM",
  DeleteLastTerm = "DELETE_LAST_TERM",
  DeleteAllTerms = "DELETE_ALL_TERMS",
  AddGeneDemoTerms = "GENE_DEMO_TERMS",
  AddCategoryDemoTerms = "CATEGORY_DEMO_TERMS",
  AddDrugDemoTerms = "DRUG_DEMO_TERMS",
  HideDisclaimer = "HIDE_DISCLAIMER",
  ShowDisclaimer = "SHOW_DISCLAIMER",
  EnableDarkMode = "ENABLE_DARK_MODE",
  DisableDarkMode = "DISABLE_DARK_MODE",
  SetByDrug = "SET_INTERACTIONS_BY_DRUG",
  SetByGene = "SET_INTERACTIONS_BY_GENE",
  SetGeneCategories = "SET_GENE_CATEGORIES",
  BrandPage = "BRAND_PAGE",
  ContentPage = "CONTENT_PAGE"
}

// search terms
type SearchTermsPayload = {
  [ActionTypes.AddTerm]: string;
  [ActionTypes.AddGeneDemoTerms]: undefined;
  [ActionTypes.AddCategoryDemoTerms]: undefined;
  [ActionTypes.AddDrugDemoTerms]: undefined;
  [ActionTypes.DeleteTerm]: string;
  [ActionTypes.DeleteLastTerm]: undefined;
  [ActionTypes.DeleteAllTerms]: undefined;
};

export type SearchTermsActions = ActionMap<
  SearchTermsPayload
>[keyof ActionMap<SearchTermsPayload>];

export const searchTermsReducer = (
  state: string[],
  action: InteractionModeActions | SearchTermsActions | ThemeSettingsActions
) => {
  let stateCopy = Array.from(state);
  switch (action.type) {
    case ActionTypes.AddTerm:
      return [...stateCopy, action.payload]
    case ActionTypes.AddGeneDemoTerms:
      return ['FLT1', 'FLT2', 'FLT3', 'STK1', 'MM1', 'AQP1', 'LOC100508755', 'FAKE1'];
    case ActionTypes.AddDrugDemoTerms:
      return ['SUNITINIB', 'ZALCITABINE', 'TRASTUZUMAB', 'NOTREAL'];
    case ActionTypes.AddCategoryDemoTerms:
      return ['HER2', 'ERBB2', 'PTGDR', 'EGFR', 'RECK', 'KCNMA1', 'MM1'];
    case ActionTypes.DeleteLastTerm:
      return stateCopy.slice(0, -1);
    case ActionTypes.DeleteAllTerms:
      return [];
    case ActionTypes.DeleteTerm:
      return stateCopy.filter((term: any) => term !== action.payload)
    default:
      return state;
  }
};

// interaction mode
type InteractionModePayload = {
  [ActionTypes.SetByDrug]: undefined;
  [ActionTypes.SetByGene]: undefined;
  [ActionTypes.SetGeneCategories]: undefined;
};

export type InteractionModeActions = ActionMap<
InteractionModePayload
>[keyof ActionMap<InteractionModePayload>];

export const interactionModeReducer = (
  state: string,
  action: InteractionModeActions | SearchTermsActions | ThemeSettingsActions
) => {
  switch (action.type) {
    case ActionTypes.SetByDrug:
      return 'drug';
    case ActionTypes.SetByGene:
      return 'gene';
    case ActionTypes.SetGeneCategories:
      return 'categories';
    default:
      return state;
  }
};

// theme settings
export interface themeSettingsType {
  showDisclaimer: boolean;
  darkModeEnabled: boolean;
  brandTheme: boolean;
}

type ThemeSettingsPayload = {
  [ActionTypes.HideDisclaimer]: undefined,
  [ActionTypes.ShowDisclaimer]: undefined,
  [ActionTypes.EnableDarkMode]: undefined,
  [ActionTypes.DisableDarkMode]: undefined
  [ActionTypes.BrandPage]: undefined,
  [ActionTypes.ContentPage]: undefined
}

export type ThemeSettingsActions = ActionMap<
  ThemeSettingsPayload
>[keyof ActionMap<ThemeSettingsPayload>];


export const themeSettingsReducer = (
  state: themeSettingsType,
  action: InteractionModeActions | SearchTermsActions | ThemeSettingsActions
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
    case ActionTypes.BrandPage:
      return {...stateCopy, brandTheme: true};
    case ActionTypes.ContentPage:
      return {...stateCopy, brandTheme: false};
    default:
      return state;
  }
};
