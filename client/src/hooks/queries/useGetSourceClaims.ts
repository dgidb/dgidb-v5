import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getSourceDrugClaims = gql`
`;

export function useGetSourceDrugClaims(name: string) {
  return useQuery(
    'drugClaims' + name,
    async () => {
      const res = await graphQLClient.request(getSourceDrugClaims, {
        name,
      });
      return res;
    },
    { enabled: name !== '' }
  );
}
