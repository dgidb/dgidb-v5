import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getCategoriesQuery = gql`
  query geneCategoriesSearch($searchTerms: [String!]!) {
    geneMatches(searchTerms: $searchTerms) {
      directMatches {
        searchTerm
        matches {
          name
          conceptId
          geneCategoriesWithSources {
            name
            sourceNames
          }
        }
      }
      ambiguousMatches {
        searchTerm
        matches {
          name
          conceptId
          geneCategoriesWithSources {
            name
            sourceNames
          }
        }
      }
      noMatches {
        searchTerm
      }
    }
  }
`;

export function useGetCategories(names: string[]) {
  return useQuery(
    'categories' + names,
    async () => {
      const res = await graphQLClient.request(getCategoriesQuery, {
        searchTerms: names,
      });
      return res;
    },
    { enabled: names.length > 0 }
  );
}
