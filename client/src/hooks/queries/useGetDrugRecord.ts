import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getDrugRecordQuery = gql`
  query drug($conceptId: String!) {
    drug(conceptId: $conceptId) {
      conceptId
      name
      drugAliases {
        alias
      }
      drugAttributes {
        name
        value
      }
      drugApprovalRatings {
        rating
        source {
          sourceDbName
        }
      }
      drugApplications {
        appNo
      }
    }
  }
`;

export function useGetDrugRecord(conceptId: string) {
  return useQuery(
    'drug-record' + conceptId,
    async () => {
      const res = await graphQLClient.request(getDrugRecordQuery, {
        conceptId,
      });
      return res;
    },
    { enabled: conceptId !== '' }
  );
}
