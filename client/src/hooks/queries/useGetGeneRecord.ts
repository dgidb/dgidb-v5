import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getGeneRecordQuery = gql`
query gene($name: String!) {
  gene(name: $name) {
    conceptId
    geneAttributes {
      gene {
        longName
      }
      name
      value
    }
    geneAliases {
      alias
    }
    geneClaims {
      source {
        citation
      }
    }
    geneCategories {
      name
    }
  }
}
`

export function useGetGeneRecord(name: string) {
  return useQuery('gene-record' + name, async () => {
    const res = await graphQLClient.request(
      getGeneRecordQuery,
      { name }
    );
    return res;
  },
  {enabled: name !== ''});
}
