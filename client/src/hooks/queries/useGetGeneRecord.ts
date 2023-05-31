import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

const getGeneRecordQuery = gql`
  query gene($conceptId: String!) {
    gene(conceptId: $conceptId) {
      conceptId
      name
      geneAttributes {
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
`;

export function useGetGeneRecord(conceptId: string) {
  return useQuery(
    "gene-record" + conceptId,
    async () => {
      const res = await graphQLClient.request(getGeneRecordQuery, {
        conceptId,
      });
      return res;
    },
    { enabled: conceptId !== "" }
  );
}
