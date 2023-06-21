import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getInteractionRecordQuery = gql`
  query interaction($id: ID!) {
    interaction(id: $id) {
      gene {
        name
        conceptId
      }
      drug {
        name
        conceptId
      }
      interactionTypes {
        directionality
        type
      }
      interactionScore
      publications {
        id
        pmid
        citation
      }
      interactionAttributes {
        name
        value
      }
    }
  }
`;

export function useGetInteractionRecord(id: string) {
  return useQuery(
    id,
    async () => {
      const res = await graphQLClient.request(getInteractionRecordQuery, {
        id,
      });
      return res;
    },
    { enabled: id !== '' }
  );
}
