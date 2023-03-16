import { useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { graphQLClient } from 'config';

const getDrugRecordQuery = gql`
query drug($name: String!) {
  drug(name: $name) {
    conceptId
    drugAliases {
      alias
    }
    drugAttributes {
      id
      name
      value
    }
    drugApprovalRatings {
      rating
      source{
        sourceDbName
      }
    }
    drugApplications {
      appNo
    }
  }
}
`

export function useGetDrugRecord(name: string) {
  return useQuery('drug-record' + name, async () => {
    const res = await graphQLClient.request(
      getDrugRecordQuery,
      { name }
    );
    return res;
  },
  {enabled: name !== ""});
}
