import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

const getDrugInteractionsQuery = gql`
  query drug($conceptId: String!) {
    drug(conceptId: $conceptId) {
      name
      interactions {
        id
        interactionScore
        interactionTypes {
          type
          directionality
        }
        publications {
          citation
          pmid
        }
        sources {
          fullName
        }
        gene {
          name
          conceptId
        }
      }
    }
  }
`;

export function useGetDrugInteractions(conceptId: string) {
  return useQuery(
    "drug-interactions" + conceptId,
    async () => {
      const res = await graphQLClient.request(getDrugInteractionsQuery, {
        conceptId,
      });
      return res;
    },
    { enabled: conceptId !== "" }
  );
}
