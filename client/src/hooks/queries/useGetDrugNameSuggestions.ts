import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getDrugNameSuggestionsQuery = gql`
query drugNameSuggestions($name: String!) {
  drugs(name: $name, first: 10) {
    nodes {
      name
    }
  }
}
`

export function useGetDrugNameSuggestions(searchTerm: string) {
  return useQuery('drug-name-suggestion' + searchTerm, async () => {
    const res = await graphQLClient.request(
      getDrugNameSuggestionsQuery,
      { name: searchTerm }
    );
    return res;
  },
  {enabled: searchTerm !== ''});
}
