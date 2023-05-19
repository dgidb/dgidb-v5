import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getGeneNameSuggestionsQuery = gql`
query geneNameSuggestions($name: String!) {
  genes(name: $name, first: 10) {
    nodes {
      name
    }
  }
}
`

const getDrugNameSuggestionsQuery = gql`
query drugNameSuggestions($name: String!) {
  drugs(name: $name, first: 10) {
    nodes {
      name
    }
  }
}
`

const getCategoryNameSuggestionsQuery = gql`
query categoryNameSuggestions($name: String!) {
  categories(name: $name, first: 10) {
    nodes {
      name
    }
  }
}
`

export function useGetNameSuggestions(searchTerm: string, type: string) {
  let queryName = 'gene-name-suggestion'
  let query = getGeneNameSuggestionsQuery
  if (type === 'drug') {
    queryName = 'drug-name-suggestion'
    query = getDrugNameSuggestionsQuery
  } else if (type === 'categories') {
    queryName = 'category-name-suggestions'
    query = getCategoryNameSuggestionsQuery
  }
  return useQuery(queryName + searchTerm, async () => {
    const res = await graphQLClient.request(
      query,
        { name: searchTerm }
      );
      return res;
    },
  {enabled: searchTerm !== ''});
}