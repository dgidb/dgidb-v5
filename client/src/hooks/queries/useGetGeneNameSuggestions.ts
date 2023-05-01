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

export function useGetGeneNameSuggestions(searchTerm: string) {
  return useQuery('gene-name-suggestion' + searchTerm, async () => {
    const res = await graphQLClient.request(
      getGeneNameSuggestionsQuery,
      { name: searchTerm }
    );
    return res;
  },
  {enabled: searchTerm !== ''});
}
