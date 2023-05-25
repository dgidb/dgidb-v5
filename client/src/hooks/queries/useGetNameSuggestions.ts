import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";
import { SearchTypes } from "types/types";

const getGeneNameSuggestionsQuery = gql`
  query geneNameSuggestions($term: String!) {
    geneSuggestions(term: $term, n: 10) {
      suggestion
    }
  }
`;

const getDrugNameSuggestionsQuery = gql`
  query drugNameSuggestions($term: String!) {
    drugSuggestions(term: $term, n: 10) {
      suggestion
    }
  }
`;

export function useGetNameSuggestions(searchTerm: string, type: SearchTypes) {
  let queryName = "gene-name-suggestion";
  let query = getGeneNameSuggestionsQuery;
  if (type === SearchTypes.Drug) {
    queryName = "drug-name-suggestion";
    query = getDrugNameSuggestionsQuery;
  }
  return useQuery(
    queryName + searchTerm,
    async () => {
      const res = await graphQLClient.request(query, { term: searchTerm });
      return res;
    },
    { enabled: searchTerm !== "" }
  );
}
