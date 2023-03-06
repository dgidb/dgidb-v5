import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getInteractionRecordQuery = gql`
query interaction($id: String!) {
    interaction(id: $id) {
        gene {
            name
        }
        drug {
            name
        }
        interactionTypes{
            directionality
            type
        }
        interactionScore
        publications{
            id
            pmid
        }
        interactionAttributes {
            name
            value
        }
  }
}
`

export function useGetInteractionRecord(id: string) {
    return useQuery('interaction-record' + id, async () => {
      const res = await graphQLClient.request(
        getInteractionRecordQuery,
        { id }
      );
      return res;
    },
    {enabled: id !== ''});
  }