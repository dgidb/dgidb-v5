import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { graphQLClient } from "config";

const getInteractionsByGenesQuery = gql`
  query genes($names: [String!]!) {
    genes(names: $names) {
      nodes {
        name
        conceptId
        interactions {
          id
          drug {
            name
            approved
            conceptId
            drugApprovalRatings {
              rating
            }
            drugAttributes {
              name
              value
            }
          }
          gene {
            name
            conceptId
          }
          interactionScore
          interactionTypes {
            type
            directionality
          }
          publications {
            pmid
          }
          sources {
            id
            fullName
          }
        }
      }
    }
  }
`;

export function useGetInteractionsByGenes(names: string[]) {
  return useQuery(
    "interactions" + names,
    async () => {
      const res = await graphQLClient.request(getInteractionsByGenesQuery, {
        names,
      });
      return res;
    },
    { enabled: names.length > 0 }
  );
}
