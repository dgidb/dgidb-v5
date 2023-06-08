import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getSourceInfo = gql`

`;

export function useGetSourceInfo(name: string) {
  return useQuery(
    'info' + name,
    async () => {
      const res = await graphQLClient.request(getSourceInfo, {
        name,
      });
      return res;
    },
    { enabled: !!name}
  );
}
