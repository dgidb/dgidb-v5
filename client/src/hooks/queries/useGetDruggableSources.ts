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
      sourceDbVersion
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
      citationShort
      pmid
      pmcid
      doi
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
      sourceDbVersion
      geneClaimsCount
      geneClaimsInGroupsCount
      citation
      citationShort
      pmid
      pmcid
      doi
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
      sourceDbVersion
      drugClaimsCount
      drugClaimsInGroupsCount
      citation
      citationShort
      pmid
      pmcid
      doi
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
      sourceDbVersion
      drugClaimsCount
      drugClaimsInGroupsCount
      geneClaimsCount
      geneClaimsInGroupsCount
      interactionClaimsCount
      interactionClaimsInGroupsCount
      citation
      citationShort
      pmid
      pmcid
      doi
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