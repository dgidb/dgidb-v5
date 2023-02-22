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
      drugClaimsCount
      drugClaimsInGroupsCount
      geneClaimsCount
      geneClaimsInGroupsCount
      interactionClaimsCount
      interactionClaimsInGroupsCount
      citation
      license
      licenseLink
    }
  }
}
`

export function useGetDruggableSources(sourceType: string) {
  return useQuery('druggable-sources' + sourceType, async () => {
    const res = await graphQLClient.request(
      getDruggableSourcesQuery,
      { sourceType }
    );
    return res;
  },
  {enabled: sourceType !==''});
}

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

export function useGetGeneSources(sourceType: string) {
  return useQuery('gene-sources' + sourceType, async () => {
    const res = await graphQLClient.request(
      getGeneSourcesQuery,
      { sourceType }
    );
    return res;
  },
  {enabled: sourceType !==''});
}

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

export function useGetDrugSources(sourceType: string) {
  return useQuery('drug-sources' + sourceType, async () => {
    const res = await graphQLClient.request(
      getDrugSourcesQuery,
      { sourceType }
    );
    return res;
  },
  {enabled: sourceType !==''});
}

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
      geneClaimsCount
      geneClaimsInGroupsCount
      interactionClaimsCount
      interactionClaimsInGroupsCount
      citation
      license
      licenseLink
    }
  }
}
`

export function useGetInteractionSources(sourceType: string) {
  return useQuery('interaction-sources' + sourceType, async () => {
    const res = await graphQLClient.request(
      getInteractionSourcesQuery,
      { sourceType }
    );
    return res;
  },
  {enabled: sourceType !==''});
}