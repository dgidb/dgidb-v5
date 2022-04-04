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
  AddTerm = "ADD_TERMS",
  DeleteTerm = "DELETE_TERMS",
  DeleteAllTerms = "DELETE_ALL_TERMS"
}

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
  action: SearchTermsActions
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
