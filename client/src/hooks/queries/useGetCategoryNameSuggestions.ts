import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getCategoryNameSuggestionsQuery = gql`
query categoryNameSuggestions($name: String!) {
  categories(name: $name, first: 10) {
    nodes {
      name
    }
  }
}
`

export function useGetCategoryNameSuggestions(searchTerm: string) {
  return useQuery('category-name-suggestion' + searchTerm, async () => {
    const res = await graphQLClient.request(
      getCategoryNameSuggestionsQuery,
      { name: searchTerm }
    );
    return res;
  },
  {enabled: searchTerm !== ''});
}
