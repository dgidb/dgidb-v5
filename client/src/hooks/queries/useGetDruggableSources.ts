import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getDruggableSourcesQuery = gql`
query sources($sourceType: SourceTypeFilter) {
  sources(sourceType: $sourceType) {
    pageInfo {
      endCursor
      startCursor
      hasNextPage
      hasPreviousPage
    }
    nodes {
      sourceDbName
    }
  }
}
`

export function useGetDruggableSources(sourceType: string) {
  return useQuery('druggable-sources', async () => {
    const res = await graphQLClient.request(
      getDruggableSourcesQuery,
      { sourceType }
    );
    return res;
  },
  {enabled: sourceType !==''});
}
