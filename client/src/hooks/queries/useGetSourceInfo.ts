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
        baseUrl
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
`;

export const useGetDruggableSources = (enabled: boolean = true) => {
  const sourceType = 'POTENTIALLY_DRUGGABLE';
  return useQuery(
    'druggable-sources' + sourceType,
    async () => {
      const res = await graphQLClient.request(getDruggableSourcesQuery, {
        sourceType,
      });
      return res;
    },
    { enabled: enabled }
  );
};

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
        baseUrl
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
`;

export function useGetGeneSources() {
  const sourceType = 'GENE';
  return useQuery(
    'gene-sources' + sourceType,
    async () => {
      const res = await graphQLClient.request(getGeneSourcesQuery, {
        sourceType,
      });
      return res;
    },
    { enabled: true }
  );
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
        baseUrl
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
`;

export function useGetDrugSources() {
  const sourceType = 'DRUG'
  return useQuery(
    'drug-sources' + sourceType,
    async () => {
      const res = await graphQLClient.request(getDrugSourcesQuery, {
        sourceType,
      });
      return res;
    },
    { enabled: true }
  );
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
        baseUrl
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
`;

export function useGetInteractionSources() {
  const sourceType = 'INTERACTION';
  return useQuery(
    'interaction-sources' + sourceType,
    async () => {
      const res = await graphQLClient.request(getInteractionSourcesQuery, {
        sourceType,
      });
      return res;
    },
    { enabled: true }
  );
}
