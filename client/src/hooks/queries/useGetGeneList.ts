import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

//TODO: this works in graphiql but not here? Field 'nodes' doesnt exist on type 'Query'
const getGeneListQuery = gql`
query categories($categoryName: [String!]!) {
  nodes {
    name
    id
    genes (first:10) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
      nodes {
        name
        longName
        geneCategoriesWithSources (categoryName: "ENZYME") {
          sourceNames
        }
      }
    }
  }
}
`

export function useGetGeneList(name: string[]) {
  return useQuery('gene-list', async () => {
    const res = await graphQLClient.request(
      getGeneListQuery,
      { name }
    );
    return res;
  },
  {enabled: name !== []});
}