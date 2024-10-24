import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getGeneInteractionsQuery = gql`
  query gene($conceptId: String!) {
    gene(conceptId: $conceptId) {
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
        drug {
          name
          conceptId
        }
      }
    }
  }
`;

export function useGetGeneInteractions(conceptId: string) {
  return useQuery(
    'gene-interactions' + conceptId,
    async () => {
      const res = await graphQLClient.request(getGeneInteractionsQuery, {
        conceptId,
      });
      return res;
    },
    { enabled: conceptId !== '' }
  );
}
