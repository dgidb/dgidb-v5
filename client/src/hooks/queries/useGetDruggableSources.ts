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
      categoriesInSource {
        name
        geneCount
      }
    }
  }
}
`

const getGeneSourcesQuery = gql`
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
      geneClaimsCount
      geneClaimsInGroupsCount
      citation
      license
      licenseLink
    }
  }
}
`

const getDrugSourcesQuery = gql`
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
      drugClaimsCount
      drugClaimsInGroupsCount
      citation
      license
      licenseLink
    }
  }
}
`

const getInteractionSourcesQuery = gql`
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
      drugClaimsCount
      drugClaimsInGroupsCount
      citation
      license
      licenseLink
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