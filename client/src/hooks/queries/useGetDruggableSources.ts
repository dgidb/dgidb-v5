import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getDruggableSourcesQuery = gql`
query sources($sourceType: String!) {
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
